from flask import Flask, render_template_string, request, redirect, session
import psycopg2

app = Flask(__name__)
app.secret_key = 'your_super_secret_key_here'  # Very important for session security

# Database connection
conn = psycopg2.connect(
    dbname="mydatabase",
    user="claudio",
    password="audioguide",
    host="localhost",
    port="5432"
)

# Available museum -> table name mapping
museum_tables = {
    'louvre': 'artworks_louvre',
    'moma': 'artworks_moma',
    'uffizi': 'artworks_uffizi'
}

# Admin login credentials
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'audioguide'

@app.route('/')
def homepage():
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Wähle dein Museum aus</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                background: #cce7ff; /* light blue */
                font-family: 'Helvetica Neue', sans-serif;
                padding: 40px;
                text-align: center;
            }
            h1 {
                margin-bottom: 40px;
                color: #e65100;
            }
            .museums {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }
            .museum-tile {
                background: #ffffff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                font-size: 20px;
                color: #333;
                text-decoration: none;
                transition: 0.3s;
            }
            .museum-tile:hover {
                background: #fb8c00;
                color: white;
                transform: translateY(-5px);
            }
        </style>
    </head>
    <body>
        <h1>Thank you Cloudflare</h1>
        <div class="museums">
            <a class="museum-tile" href="/museum/louvre">Louvre</a>
            <a class="museum-tile" href="/museum/moma">MoMA</a>
            <a class="museum-tile" href="/museum/uffizi">Uffizi Gallery</a>
        </div>
    </body>
    </html>
    """
    return render_template_string(html)

@app.route('/museum/<museum>')
def show_museum(museum):
    if museum not in museum_tables:
        return "Museum not found", 404

    table_name = museum_tables[museum]

    cur = conn.cursor()
    try:
        cur.execute(f"SELECT title, artist, year, audio_url, description FROM {table_name} ORDER BY artist ASC;")
        rows = cur.fetchall()
        conn.commit()
    except Exception as e:
        cur.close()
        conn.rollback()
        return f"Error: {str(e)}", 500
    cur.close()

    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>{{ museum|capitalize }} - Artworks</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
        <style>
            body {
                font-family: 'Helvetica Neue', sans-serif;
                background: #cce7ff; /* light blue */
                padding: 20px;
            }
            a.back-link {
                display: inline-block;
                margin-bottom: 20px;
                text-decoration: none;
                background: #fb8c00;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
            }
            table.dataTable {
                width: 100%;
                border-collapse: collapse;
                background: white;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                border-radius: 12px;
                overflow: hidden;
            }
            th, td {
                padding: 15px;
                text-align: left;
                border-bottom: 1px solid #ccc;
            }
            th {
                background: #fb8c00;
                color: white;
                font-size: 18px;
            }
            tr:hover {
                background: #ffe0b2;
            }
        </style>
    </head>
    <body>

    <a class="back-link" href="/">← Back to Museums</a>

    <h2>{{ museum|capitalize }}</h2>

    {% if artworks %}
    <table id="artworksTable">
        <thead>
        <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Audio URL</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        {% for title, artist, year, audio_url, description in artworks %}
        <tr>
            <td>{{ title }}</td>
            <td>{{ artist }}</td>
            <td>{{ year }}</td>
            <td><a href="{{ audio_url }}" target="_blank">{{ 'Link' if audio_url != 'none' else 'None' }}</a></td>
            <td>{{ description }}</td>
        </tr>
        {% endfor %}
        </tbody>
    </table>
    {% else %}
    <p>No artworks yet. Come back later!</p>
    {% endif %}

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#artworksTable').DataTable();
        });
    </script>

    </body>
    </html>
    """
    return render_template_string(html, museum=museum, artworks=rows)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if not session.get('logged_in'):
        return redirect('/login')

    if request.method == 'POST':
        museum = request.form['museum']
        title = request.form['title']
        artist = request.form['artist']
        year = request.form['year']
        audio_url = request.form['audio_url']
        description = request.form['description']

        if museum not in museum_tables:
            return "Invalid museum selection", 400

        table_name = museum_tables[museum]

        cur = conn.cursor()
        try:
            cur.execute(f"""
                INSERT INTO {table_name} (title, artist, year, audio_url, description)
                VALUES (%s, %s, %s, %s, %s)
            """, (title, artist, year, audio_url, description))
            conn.commit()
        except Exception as e:
            conn.rollback()
            return f"Error: {str(e)}", 500
        cur.close()

        return redirect('/')

    form_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Add New Artwork</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Helvetica Neue', sans-serif;
                background: #cce7ff; /* light blue */
                padding: 20px;
            }
            form {
                max-width: 400px;
                margin: auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            select, input, textarea {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 8px;
                font-size: 16px;
            }
            button {
                background: #fb8c00;
                color: white;
                padding: 12px;
                width: 100%;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                cursor: pointer;
            }
            button:hover {
                background: #ef6c00;
            }
        </style>
    </head>
    <body>
        <h2 style="text-align:center;">Add New Artwork</h2>
        <form method="POST">
            <select name="museum" required>
                <option value="">Select Museum</option>
                <option value="louvre">Louvre</option>
                <option value="moma">MoMA</option>
                <option value="uffizi">Uffizi Gallery</option>
            </select>
            <input type="text" name="title" placeholder="Title" required>
            <input type="text" name="artist" placeholder="Artist" required>
            <input type="number" name="year" placeholder="Year" required>
            <input type="text" name="audio_url" placeholder="Audio URL (or 'none')" required>
            <textarea name="description" placeholder="Description" required></textarea>
            <button type="submit">Add Artwork</button>
        </form>
    </body>
    </html>
    """
    return render_template_string(form_html)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            return redirect('/admin')
        else:
            return "Invalid credentials", 401

    login_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Helvetica Neue', sans-serif;
                background: #ffcc80;
                padding: 20px;
            }
            form {
                max-width: 400px;
                margin: auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            input {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 8px;
                font-size: 16px;
            }
            button {
                background: #fb8c00;
                color: white;
                padding: 12px;
                width: 100%;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                cursor: pointer;
            }
            button:hover {
                background: #ef6c00;
            }
        </style>
    </head>
    <body>
        <h2 style="text-align:center;">Admin Login</h2>
        <form method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    </body>
    </html>
    """
    return render_template_string(login_html)

@app.route('/logout')
def logout():
    session['logged_in'] = False
    return redirect('/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
