import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import CardItem from '../components/CardItem';
import CollectionItem from '../components/CollectionItem';
import LoadingSpinner from '../components/LoadingSpinner';
import NavigationBar from '../components/NavigationBar';
import ErrorMessage from '../components/ErrorMessage';
import '../styling/collection.css';

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [tag, setTag] = useState("");
  const [isCollectionMinimized, setIsCollectionMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/collection").then(
      res => res.json()
    ).then(
      data => {
        setCollection(data);
        setLoading(false);
      }
    ).catch(
      error => {
        console.error("Error fetching collection:", error);
        setLoading(false);
        setError("Failed to load collection");
      }
    );
  }, []);

  const handleSearch = () => {
    setLoading(true);
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
        setLoading(false);
      }
    ).catch(
      error => {
        console.error("Error searching for cards:", error);
        setLoading(false);
        setError("Failed to search for cards");
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
    }).then(
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
    }).then(
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
    }).then(
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

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * 20; // Adjust the rotation values as needed
    const rotateY = (x / rect.width - 0.5) * 20;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const overlay = card.querySelector('.overlay');
    overlay.style.backgroundPosition = `${x / rect.width * 100}% ${y / rect.height * 100}%`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';

    const overlay = card.querySelector('.overlay');
    overlay.style.backgroundPosition = '50% 50%';
  };

  const totalValue = collection.reduce((sum, card) => sum + parseFloat(card.prices.usd || 0), 0).toFixed(2);

  return (
    <div className="collection-page">
      <header className="page-header">
      <NavigationBar/>
      </header>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sortDir={sortDir}
        setSortDir={setSortDir}
        handleSearch={handleSearch}
      />
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      <div className="search-results">
        {searchResults.map((card, index) => (
          <CardItem
            key={index}
            card={card}
            onAddToCollection={addCardToCollection}
            handleMouseMove={handleMouseMove}
            handleMouseLeave={handleMouseLeave}
          />
        ))}
      </div>

      <div className="divider"></div>

      <div className="collection-header">
        <h2>My Collection</h2>
        <button onClick={() => setIsCollectionMinimized(!isCollectionMinimized)} className="toggle-button">
          {isCollectionMinimized ? "Expand" : "Minimize"}
        </button>
      </div>
      <div className="total-value">
        <b>Total Value:</b> ${totalValue}
      </div>
      {!isCollectionMinimized ? (
        <div className="card-grid">
          {collection.map((card, index) => (
            <CollectionItem
              key={index}
              card={card}
              onRemoveFromCollection={removeCardFromCollection}
              onRemoveTag={removeTagFromCard}
              onAddTag={addTagToCard}
              tag={tag}
              setTag={setTag}
              handleMouseMove={handleMouseMove}
              handleMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
      ) : (
        <p className="minimized-message">Collection is minimized.</p>
      )}
    </div>
  );
};

export default Collection;

