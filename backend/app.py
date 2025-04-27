from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

DB_HOST = "127.0.0.1"
DB_NAME = "audioguide"
DB_USER = "claudio"
DB_PASS = "audioguide"

def get_db_connection():
    conn = psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
    return conn

@app.route('/api/museums')
def get_museums():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name FROM museums;')
    museums = [{'id': row[0], 'name': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(museums)

@app.route('/api/museums/<int:museum_id>')
def get_museum(museum_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name FROM museums WHERE id = %s;', (museum_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row:
        museum = {'id': row[0], 'name': row[1]}
        return jsonify(museum)
    else:
        return jsonify({'error': 'Museum not found'}), 404

@app.route('/api/museums/<int:museum_id>/artworks')
def get_artworks(museum_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, title, artist, year, exhibition, text, audiofile FROM artworks WHERE museum_id = %s;', (museum_id,))
    artworks = [{'id': row[0], 'title': row[1], 'artist': row[2], 'year': row[3], 'exhibition': row[4], 'text': row[5], 'audiofile': row[6]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(artworks)

@app.route('/api/museums/<int:museum_id>/artworks', methods=['POST'])
def add_artwork(museum_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO artworks (museum_id, title, artist, year, exhibition, text, audiofile) VALUES (%s, %s, %s, %s, %s, %s, %s);',
                (museum_id, data['title'], data['artist'], data['year'], data['exhibition'], data['text'], data['audiofile']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Artwork added successfully"})

@app.route('/api/museums/<int:museum_id>/artworks/bulk', methods=['POST'])
def bulk_add_artworks(museum_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    for artwork in data:
        cur.execute('INSERT INTO artworks (museum_id, title, artist, year, exhibition, text, audiofile) VALUES (%s, %s, %s, %s, %s, %s, %s);',
                    (museum_id, artwork['title'], artwork['artist'], artwork['year'], artwork['exhibition'], artwork['text'], artwork['audiofile']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Bulk artworks added successfully"})

@app.route('/api/artworks/<int:artwork_id>', methods=['PUT'])
def update_artwork(artwork_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        UPDATE artworks
        SET title = %s,
            artist = %s,
            year = %s,
            exhibition = %s,
            text = %s,
            audiofile = %s
        WHERE id = %s
    ''', (data['title'], data['artist'], data['year'], data['exhibition'], data['text'], data['audiofile'], artwork_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Artwork updated successfully"})

@app.route('/api/artworks/<int:artwork_id>', methods=['DELETE'])
def delete_artwork(artwork_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM artworks WHERE id = %s', (artwork_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Artwork deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
