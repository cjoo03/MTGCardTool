import React, { useEffect, useState } from 'react';
import HomeButton from '../components/HomeButton';
import '../styling/styles.css';  // Ensure this path is correct

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [tag, setTag] = useState("");
  const [isCollectionMinimized, setIsCollectionMinimized] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/collection").then(
      res => res.json()
    ).then(
      data => {
        setCollection(data);
      }
    );
  }, []);

  const handleSearch = () => {
    fetch("http://localhost:8000/search_card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ search_term: searchTerm, order: sortOrder, dir: sortDir, unique: "prints" })
    }).then(
      res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      }
    ).then(
      data => {
        setSearchResults(data.data || []);
      }
    ).catch(
      error => {
        console.error("Error searching for cards:", error);
      }
    );
  };

  const addCardToCollection = (cardId) => {
    fetch("http://localhost:8000/api/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card_id: cardId }),
    }).then (
      res => res.json()
    ).then(
      data => {
        setCollection([...collection, data]);
      }
    ).catch(
      error => console.error("Error adding card to collection: ", error)
    );
  };

  const removeCardFromCollection = (cardId) => {
    fetch(`http://localhost:8000/api/collection/${cardId}`, {
      method: "DELETE",
    }).then(
      () => {
        setCollection(collection.filter(card => card.id !== cardId));
      }
    ).catch(
      error => console.error("Error removing card from collection:", error)
    );
  };

  const addTagToCard = (cardId, tag) => {
    fetch("http://localhost:8000/api/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card_id: cardId, tag }),
    }).then (
      res => res.json()
    ).then(
      () => {
        const updatedCollection = collection.map(card => {
          if (card.id === cardId) {
            return {
              ...card,
              tags: [...card.tags, tag]
            };
          }
          return card;
        });
        setCollection(updatedCollection);
      }
    ).catch(
      error => console.error("Error adding tag to card: ", error)
    );
  };

  const removeTagFromCard = (cardId, tag) => {
    fetch("http://localhost:8000/api/tags", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card_id: cardId, tag }),
    }).then (
      res => res.json()
    ).then(
      () => {
        const updatedCollection = collection.map(card => {
          if (card.id === cardId) {
            return {
              ...card,
              tags: card.tags.filter(t => t !== tag)
            };
          }
          return card;
        });
        setCollection(updatedCollection);
      }
    ).catch(
      error => console.error("Error removing tag from card: ", error)
    );
  };

  return (
    <div>
      <h2>My Collection</h2>

      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search for cards" 
      />
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="name">Name</option>
        <option value="set">Set</option>
        <option value="released">Release Date</option>
        <option value="rarity">Rarity</option>
        <option value="usd">Price (USD)</option>
        <option value="eur">Price (EUR)</option>
      </select>
      <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button onClick={handleSearch}>Search</button>

      <div>
        <HomeButton />
        <h2>Search Results</h2>
        <div className="search-results">
          {searchResults.map((card, index) => (
            <div key={index} className="card-container">
              <img src={card.image_uris?.normal} alt={card.name} />
              <div className="card-details">
                <h4>{card.name}</h4>
                <p>{card.type_line}</p>
                <p>{card.mana_cost}</p>
                <p>{card.oracle_text}</p>
                <p><b>Price:</b> ${card.prices.usd}</p>
              </div>
              <button onClick={() => addCardToCollection(card.id)}>Add to Collection</button>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <div className="collection-header">
          <h2>My Collection</h2>
          <button onClick={() => setIsCollectionMinimized(!isCollectionMinimized)}>
            {isCollectionMinimized ? "Expand" : "Minimize"}
          </button>
        </div>
        {!isCollectionMinimized ? (
          <div className="collection-container">
            {collection.map((card, index) => (
              <div key={index} className="card-container">
                <img src={card.image_uris?.normal} alt={card.name} />
                <div className="card-details">
                  <h4>{card.name}</h4>
                  <p>{card.type_line}</p>
                  <p>{card.mana_cost}</p>
                  <p>{card.oracle_text}</p>
                  <p><b>Price:</b> ${card.prices.usd}</p>
                  <div>
                    <h5>Tags:</h5>
                    {card.tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                        <button onClick={() => removeTagFromCard(card.id, tag)}>x</button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={tag} 
                      onChange={(e) => setTag(e.target.value)} 
                      placeholder="Add a tag" 
                    />
                    <button onClick={() => addTagToCard(card.id, tag)}>Add Tag</button>
                  </div>
                </div>
                <button className="remove-button" onClick={() => removeCardFromCollection(card.id)}>-</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="collection-minimized" onClick={() => setIsCollectionMinimized(false)}>
            {collection.length} {collection.length === 1 ? "card" : "cards"} in collection
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
