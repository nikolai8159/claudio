from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://192.168.178.61:3000"}})

# Dummy museum list
museums = [
    {"id": "louvre", "name": "Louvre"},
    {"id": "moma", "name": "MoMA"},
    {"id": "uffizi", "name": "Uffizi Gallery"}
]

@app.route('/api/museums')
def get_museums():
    return jsonify(museums)

@app.route('/api/museums/<museum_id>')
def get_museum(museum_id):
    museum = next((m for m in museums if m["id"] == museum_id), None)
    if museum:
        return jsonify(museum)
    else:
        return jsonify({"error": "Museum not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
