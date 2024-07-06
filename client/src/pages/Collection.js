import React, { useEffect, useState } from 'react';

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
    fetch("http://localhost:8000/search_card", {  // Make sure the URL is correct
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ search_term: searchTerm })
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

  return (
    <div>
      <h2>My Collection</h2>

      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search for cards" 
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        <h2>Search Results</h2>
        {searchResults.map((card, index) => (
          <div key={index}>
            <img src={card.image_uris?.normal} alt={card.name} />
            <h4>{card.name}</h4>
            <p>{card.type_line}</p>
            <p>{card.mana_cost}</p>
            <p>{card.oracle_text}</p>
            <button onClick={() => addCardToCollection(card.id)}>Add to Collection</button>
          </div>
        ))}
      </div>

      <div>
        {collection.length > 0 ? (
          collection.map((card, index) => (
            <div key={index}>
              <img src={card.image_uris?.normal} alt={card.name} />
              <h4>{card.name}</h4>
              <p>{card.type_line}</p>
              <p>{card.mana_cost}</p>
              <p>{card.oracle_text}</p>
              <button onClick={() => removeCardFromCollection(card.id)}>Remove from Collection</button>
            </div>
          ))
        ) : (
          <p>No cards in collection.</p>
        )}
      </div>
    </div>
  );
};

export default Collection;
