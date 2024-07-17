import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styling/set.css';

export default function Set() {
  const { setCode } = useParams();
  const [cards, setCards] = useState([]);
  const [sortOrder, setSortOrder] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [setInfo, setSetInfo] = useState(null);

  useEffect(() => {
    // Fetch set information
    fetch(`https://api.scryfall.com/sets/${setCode}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched set data:', data);
        setSetInfo(data);
        // Fetch cards in the set using the search_uri
        return fetch(data.search_uri);
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched cards data:', data);
        setCards(data.data);
      })
      .catch(error => console.error("Error fetching set or cards:", error));
  }, [setCode]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSortDirChange = (e) => {
    setSortDir(e.target.value);
  };

  const sortedCards = [...cards].sort((a, b) => {
    if (sortOrder === "usd") {
      const priceA = parseFloat(a.prices.usd || 0);
      const priceB = parseFloat(b.prices.usd || 0);
      return sortDir === "asc" ? priceA - priceB : priceB - priceA;
    } else if (sortOrder === "name") {
      return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortOrder === "set_number") {
      const numberA = parseInt(a.collector_number, 10);
      const numberB = parseInt(b.collector_number, 10);
      return sortDir === "asc" ? numberA - numberB : numberB - numberA;
    }
    return 0;
  });

  return (
    <div className="set-container">
      {setInfo && <h2>Set: {setInfo.name}</h2>}
      <div className="sort-options">
        <label>
          Sort by: 
          <select value={sortOrder} onChange={handleSortChange}>
            <option value="name">Name</option>
            <option value="usd">Price (USD)</option>
            <option value="set_number">Set Number</option>
          </select>
        </label>
        <label>
          Direction: 
          <select value={sortDir} onChange={handleSortDirChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
      <div className="card-grid">
        {sortedCards.map((card, index) => (
          <div key={index} className="card-container">
            <div className="overlay"></div>
            <img src={card.image_uris?.normal} alt={card.name} className="card" />
            <div className="card-details">
              <h4>{card.name}</h4>
              <p>{card.type_line}</p>
              <p>{card.mana_cost}</p>
              <p>{card.oracle_text}</p>
              <p><b>Price:</b> ${card.prices.usd}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
