from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://192.168.178.61:3000"}})

# Database connection parameters
DB_HOST = "127.0.0.1"
DB_NAME = "audioguide"
DB_USER = "claudio"
DB_PASS = "audioguide"  # <-- IMPORTANT: replace with your real password

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    return conn

# -------------------------
# Museums Endpoints
# -------------------------

@app.route('/api/museums', methods=['GET'])
def get_museums():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name FROM museums;')
    museums = [{"id": row[0], "name": row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(museums)

@app.route('/api/museums/<int:museum_id>', methods=['GET'])
def get_museum(museum_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name, location, description FROM museums WHERE id = %s;', (museum_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row:
        museum = {
            "id": row[0],
            "name": row[1],
            "location": row[2],
            "description": row[3]
        }
        return jsonify(museum)
    else:
        return jsonify({"error": "Museum not found"}), 404

# -------------------------
# Artworks Endpoints
# -------------------------

@app.route('/api/museums/<int:museum_id>/artworks', methods=['GET'])
def get_artworks(museum_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, title, artist, year, exhibition, text, audiofile FROM artworks WHERE museum_id = %s;', (museum_id,))
    artworks = []
    for row in cur.fetchall():
        artworks.append({
            "id": row[0],
            "title": row[1],
            "artist": row[2],
            "year": row[3],
            "exhibition": row[4],
            "text": row[5],
            "audiofile": row[6]
        })
    cur.close()
    conn.close()
    return jsonify(artworks)

@app.route('/api/museums/<int:museum_id>/artworks', methods=['POST'])
def add_artwork(museum_id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO artworks (museum_id, title, artist, year, exhibition, text, audiofile)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    ''', (museum_id, data.get('title'), data.get('artist'), data.get('year'),
          data.get('exhibition'), data.get('text'), data.get('audiofile')))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Artwork added successfully!"}), 201

@app.route('/api/museums/<int:museum_id>/artworks/bulk', methods=['POST'])
def add_bulk_artworks(museum_id):
    artworks = request.get_json()  # List of artworks
    conn = get_db_connection()
    cur = conn.cursor()
    
    for art in artworks:
        cur.execute('''
            INSERT INTO artworks (museum_id, title, artist, year, exhibition, text, audiofile)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        ''', (museum_id, art.get('title'), art.get('artist'), art.get('year'), art.get('exhibition'), art.get('text'), art.get('audiofile')))
    
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Bulk artworks added successfully!"}), 201

# -------------------------
# Server Starter
# -------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
