from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://192.168.178.61:3000"}})

# Initial dummy data
museums = [
    {"id": "louvre", "name": "Louvre"},
    {"id": "moma", "name": "MoMA"},
    {"id": "uffizi", "name": "Uffizi Gallery"}
]

artworks = {
    "louvre": [
        {
            "id": "mona-lisa",
            "title": "Mona Lisa",
            "artist": "Leonardo da Vinci",
            "description": "A portrait painting by Leonardo da Vinci.",
            "audio_url": "/audio/mona-lisa.mp3"
        }
    ],
    "moma": [
        {
            "id": "starry-night",
            "title": "The Starry Night",
            "artist": "Vincent van Gogh",
            "description": "One of van Gogh's most famous paintings.",
            "audio_url": "/audio/starry-night.mp3"
        }
    ],
    "uffizi": [
        {
            "id": "birth-of-venus",
            "title": "The Birth of Venus",
            "artist": "Sandro Botticelli",
            "description": "One of the most famous paintings of the Renaissance.",
            "audio_url": "/audio/birth-of-venus.mp3"
        }
    ]
}

# -------------------------
# Museums Endpoints
# -------------------------

@app.route('/api/museums', methods=['GET'])
def get_museums():
    return jsonify(museums)

@app.route('/api/museums', methods=['POST'])
def add_museum():
    data = request.get_json()
    museums.append(data)
    return jsonify({"message": "Museum added successfully"}), 201

@app.route('/api/museums/<museum_id>', methods=['GET'])
def get_museum(museum_id):
    museum = next((m for m in museums if m["id"] == museum_id), None)
    if museum:
        return jsonify(museum)
    else:
        return jsonify({"error": "Museum not found"}), 404

@app.route('/api/museums/<museum_id>', methods=['PUT'])
def update_museum(museum_id):
    data = request.get_json()
    for museum in museums:
        if museum["id"] == museum_id:
            museum.update(data)
            return jsonify({"message": "Museum updated successfully"})
    return jsonify({"error": "Museum not found"}), 404

@app.route('/api/museums/<museum_id>', methods=['DELETE'])
def delete_museum(museum_id):
    global museums
    museums = [m for m in museums if m["id"] != museum_id]
    artworks.pop(museum_id, None)
    return jsonify({"message": "Museum deleted successfully"})

# -------------------------
# Artworks Endpoints
# -------------------------

@app.route('/api/museums/<museum_id>/artworks', methods=['GET'])
def get_artworks(museum_id):
    return jsonify(artworks.get(museum_id, []))

@app.route('/api/museums/<museum_id>/artworks', methods=['POST'])
def add_artwork(museum_id):
    data = request.get_json()
    if museum_id not in artworks:
        artworks[museum_id] = []
    artworks[museum_id].append(data)
    return jsonify({"message": "Artwork added successfully"}), 201

@app.route('/api/museums/<museum_id>/artworks/<artwork_id>', methods=['PUT'])
def update_artwork(museum_id, artwork_id):
    if museum_id in artworks:
        for art in artworks[museum_id]:
            if art["id"] == artwork_id:
                data = request.get_json()
                art.update(data)
                return jsonify({"message": "Artwork updated successfully"})
    return jsonify({"error": "Artwork not found"}), 404

@app.route('/api/museums/<museum_id>/artworks/<artwork_id>', methods=['DELETE'])
def delete_artwork(museum_id, artwork_id):
    if museum_id in artworks:
        artworks[museum_id] = [art for art in artworks[museum_id] if art["id"] != artwork_id]
        return jsonify({"message": "Artwork deleted successfully"})
    return jsonify({"error": "Artwork not found"}), 404

# -------------------------
# Server Starter
# -------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
