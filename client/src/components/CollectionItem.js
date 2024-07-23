import React from 'react';

const CollectionItem = ({ card, onRemoveFromCollection, onRemoveTag, onAddTag, tag, setTag, handleMouseMove, handleMouseLeave }) => {
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
        <div className="tags">
          {card.tags && card.tags.map((tag, tagIndex) => (
            <span key={tagIndex} className="tag">
              {tag} <button onClick={() => onRemoveTag(card.id, tag)}>x</button>
            </span>
          ))}
        </div>
        <input 
          type="text" 
          value={tag} 
          onChange={(e) => setTag(e.target.value)} 
          placeholder="Add tag" 
          className="tag-input"
        />
        <button onClick={() => onAddTag(card.id, tag)} className="tag-button">Add Tag</button>
      </div>
      <button onClick={() => onRemoveFromCollection(card.id)} className="card-action-button">Remove from Collection</button>
    </div>
  );
};

export default CollectionItem;
