import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationBar';

const CommanderDis = () => {
  const [commanderCard, setCommanderCard] = useState(null);

  const fetchCommanderCard = () => {
    fetch("http://localhost:8000/commander_card").then(
      res => res.json()
    ).then(
      data => {
        setCommanderCard(data);
      }
    ).catch(
      error => {
        console.error("Error fetching commander card:", error);
      }
    );
  };

  useEffect(() => {
    fetchCommanderCard();
  }, []);

  return (
    <div>
      <NavigationBar/>
      {commanderCard ? (
        <div>
          <img src={commanderCard.image_uris.normal} alt={commanderCard.name} />
          <h2>{commanderCard.name}</h2>
          <p><b>Type:</b> {commanderCard.type_line}</p>
          <p><b>Mana Cost:</b> {commanderCard.mana_cost}</p>
          <p>{commanderCard.oracle_text}</p>
          <p><b>Price:</b> ${commanderCard.prices.usd}</p>
          <button onClick={fetchCommanderCard}>Get Another Commander</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CommanderDis;