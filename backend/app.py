from flask import Flask, render_template_string, request, redirect, session, jsonify
import psycopg2

app = Flask(__name__)
app.secret_key = 'your_super_secret_key_here'  # Important for session security

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

# ============================
# 📚 API ROUTES
# ============================

@app.route('/api/museums', methods=['GET'])
def get_museums():
    museums = [
        {"id": "louvre", "name": "Louvre"},
        {"id": "moma", "name": "MoMA"},
        {"id": "uffizi", "name": "Uffizi Gallery"}
    ]
    return jsonify(museums)

@app.route('/api/museum/<museum_id>', methods=['GET'])
def get_museum_artworks(museum_id):
    if museum_id not in museum_tables:
        return jsonify({"error": "Museum not found"}), 404

    table_name = museum_tables[museum_id]

    cur = conn.cursor()
    try:
        cur.execute(f"SELECT title, artist, year, audio_url, description FROM {table_name} ORDER BY artist ASC;")
        rows = cur.fetchall()
    except Exception as e:
        cur.close()
        return jsonify({"error": str(e)}), 500

    cur.close()

    artworks = []
    for row in rows:
        artwork = {
            "title": row[0],
            "artist": row[1],
            "year": row[2],
            "audio_url": row[3],
            "description": row[4]
        }
        artworks.append(artwork)

    return jsonify(artworks)

# ============================
# 🔒 ADMIN ROUTES
# ============================

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

        return redirect('/admin')

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
                background: #cce7ff;
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
    return redirect('/login')

# ============================
# 🚀 START SERVER
# ============================

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
