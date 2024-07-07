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
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_id TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            tag TEXT NOT NULL
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
        card_info = get_card_details(card_id)
        card_info['tags'] = get_card_tags(card_id)
        card_details.append(card_info)

    return jsonify(card_details)

# Remove card from collection
@app.route('/api/collection/<card_id>', methods=['DELETE'])
def remove_card_from_collection(card_id):
    user_id = 1  # Placeholder for user ID

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM collection WHERE card_id = ? AND user_id = ?', (card_id, user_id))
    cursor.execute('DELETE FROM tags WHERE card_id = ? AND user_id = ?', (card_id, user_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Card removed from collection'}), 200

# Add tag to card
@app.route('/api/tags', methods=['POST'])
def add_tag():
    data = request.get_json()
    card_id = data['card_id']
    tag = data['tag']
    user_id = 1  # Placeholder for user ID

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tags (card_id, user_id, tag) VALUES (?, ?, ?)', (card_id, user_id, tag))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Tag added'}), 201

# Remove tag from card
@app.route('/api/tags', methods=['DELETE'])
def remove_tag():
    data = request.get_json()
    card_id = data['card_id']
    tag = data['tag']
    user_id = 1  # Placeholder for user ID

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tags WHERE card_id = ? AND user_id = ? AND tag = ?', (card_id, user_id, tag))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Tag removed'}), 200

def get_card_tags(card_id):
    user_id = 1  # Placeholder for user ID

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT tag FROM tags WHERE card_id = ? AND user_id = ?', (card_id, user_id))
    tags = [row[0] for row in cursor.fetchall()]
    conn.close()

    return tags

def get_card_details(card_id):
    url = f"https://api.scryfall.com/cards/{card_id}"
    response = requests.get(url)
    card_data = response.json()

    if 'tcgplayer_id' in card_data:
        tcgplayer_id = card_data['tcgplayer_id']
        tcgplayer_url = f"https://api.scryfall.com/cards/tcgplayer/{tcgplayer_id}"
        tcgplayer_response = requests.get(tcgplayer_url)
        tcgplayer_data = tcgplayer_response.json()
        card_data['price'] = tcgplayer_data.get('prices', {})

    return card_data

def get_random_card():
    url = "https://api.scryfall.com/cards/random"
    response = requests.get(url)
    return response.json()

def get_commander():
    url = "https://api.scryfall.com/cards/random?q=is%3Acommander"
    response = requests.get(url)
    return response.json()

def search_card(query, order='name', dir='asc', unique='prints'):
    url = f"https://api.scryfall.com/cards/search?q={query}&unique={unique}&order={order}&dir={dir}"
    response = requests.get(url)
    cards_data = response.json()

    if 'data' in cards_data:
        for card in cards_data['data']:
            if 'tcgplayer_id' in card:
                tcgplayer_id = card['tcgplayer_id']
                tcgplayer_url = f"https://api.scryfall.com/cards/tcgplayer/{tcgplayer_id}"
                tcgplayer_response = requests.get(tcgplayer_url)
                tcgplayer_data = tcgplayer_response.json()
                card['price'] = tcgplayer_data.get('prices', {})

    return cards_data

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
    data = request.json
    search_term = data.get('search_term')
    order = data.get('order', 'name')
    dir = data.get('dir', 'asc')
    unique = data.get('unique', 'prints')

    cards_data = search_card(search_term, order, dir, unique)

    if 'error' in cards_data:
        return jsonify({'error': 'Error fetching data from Scryfall'}), 400
    else:
        return jsonify(cards_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
