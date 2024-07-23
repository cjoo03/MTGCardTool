import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationBar';

const RandomCard = () => {
  const [randomCard, setRandomCard] = useState(null);

  const fetchRandomCard = () => {
    fetch("http://localhost:8000/random_card").then(
      res => res.json()
    ).then(
      data => {
        console.log('Random Card Data:', data);
        setRandomCard(data);
      }
    ).catch(
      error => {
        console.error("Error fetching random card:", error);
      }
    );
  };

  useEffect(() => {
    fetchRandomCard();
  }, []);

  return (
    <div>
      <NavigationBar />
      {randomCard ? (
        <div>
          <img src={randomCard.image_uris.normal} alt={randomCard.name} />
          <h2>{randomCard.name}</h2>
          <p><b>Type:</b> {randomCard.type_line}</p>
          <p><b>Mana Cost:</b> {randomCard.mana_cost}</p>
          <p>{randomCard.oracle_text}</p>
          {randomCard.prices && (
            <p><b>Price:</b> ${randomCard.prices.usd}</p>
          )}
          <button onClick={fetchRandomCard}>Get Another Random Card</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RandomCard;
