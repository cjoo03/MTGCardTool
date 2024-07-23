import React from 'react';

const CardItem = ({ card, onAddToCollection, handleMouseMove, handleMouseLeave }) => {
  return (
    <div 
      className="card-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="overlay"></div>
      <img src={card.image_uris?.normal} alt={card.name} className="card" />
      <div className="card-details">
        <h4>{card.name}</h4>
        <p>{card.type_line}</p>
        <p>{card.mana_cost}</p>
        <p>{card.oracle_text}</p>
        <p><b>Price:</b> ${card.prices.usd}</p>
      </div>
      <button onClick={() => onAddToCollection(card.id)} className="card-action-button">Add to Collection</button>
    </div>
  );
};

export default CardItem;
