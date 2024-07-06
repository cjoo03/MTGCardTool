from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Database setup
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS collection (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_id TEXT NOT NULL,
            user_id INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Add card to collection
@app.route('/api/collection', methods=['POST'])
def add_card_to_collection():
    data = request.get_json()
    card_id = data['card_id']
    user_id = 1  # Placeholder for user ID

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO collection (card_id, user_id) VALUES (?, ?)', (card_id, user_id))
    conn.commit()
    conn.close()

    card_details = get_card_details(card_id)

    return jsonify(card_details), 201

# Get user collection
@app.route('/api/collection', methods=['GET'])
def get_collection():
    user_id = 1  # Placeholder for user ID

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM collection WHERE user_id = ?', (user_id,))
    collection = cursor.fetchall()
    conn.close()

    card_details = []
    for card in collection:
        card_id = card[1]
        card_details.append(get_card_details(card_id))

    return jsonify(card_details)

# Remove card from collection
@app.route('/api/collection/<card_id>', methods=['DELETE'])
def remove_card_from_collection(card_id):
    user_id = 1  # Placeholder for user ID

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM collection WHERE card_id = ? AND user_id = ?', (card_id, user_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Card removed from collection'}), 200

def get_card_details(card_id):
    url = f"https://api.scryfall.com/cards/{card_id}"
    response = requests.get(url)
    return response.json()

def get_random_card():
    url = "https://api.scryfall.com/cards/random"
    response = requests.get(url)
    return response.json()

def get_commander():
    url = "https://api.scryfall.com/cards/random?q=is%3Acommander"
    response = requests.get(url)
    return response.json()

def search_card(query):
    url = f"https://api.scryfall.com/cards/search?q={query}"
    response = requests.get(url)
    return response.json()

# Creates a route for the random card endpoint

@app.route("/commander_card")
def commander_card():
    commander_data = get_commander()
    return jsonify(commander_data)

@app.route("/random_card")
def random_card():
    card_data = get_random_card()
    return jsonify(card_data)

@app.route("/search_card", methods=["POST"])
def search_card_route():
    search_term = request.json.get("search_term")
    search_results = search_card(search_term)
    return jsonify(search_results)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)