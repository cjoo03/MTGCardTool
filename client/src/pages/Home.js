import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styling/home.css';

export default function Home() {
  const [featuredCard, setFeaturedCard] = useState(null);

  useEffect(() => {
    fetch("https://api.scryfall.com/cards/wot/91") // Adjust the endpoint as needed
      .then(res => res.json())
      .then(data => {
        setFeaturedCard(data);
      })
      .catch(error => console.error("Error fetching featured card:", error));
  }, []);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * 30; // Rotate around X-axis
    const rotateY = (x / rect.width - 0.5) * 30;  // Rotate around Y-axis

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const overlay = card.querySelector('.overlay');
    overlay.style.backgroundPosition = `${x / rect.width * 100}% ${y / rect.height * 100}%`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';

    const overlay = card.querySelector('.overlay');
    overlay.style.backgroundPosition = '50% 50%'; // Reset to center
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/commander">Commander Discovery</Link></li>
          <li><Link to="/collection">Collection</Link></li>
          <li><Link to="/random">Random Card</Link></li>
        </ul>
      </nav>
      <header className="home-header">
        <h1>Welcome to MTG Card Collection Tracker</h1>
        <p>This is your ultimate tool for managing and tracking your Magic: The Gathering card collection.</p>
      </header>
      <div className="container">
        {featuredCard && (
          <div 
            className="card-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="overlay"></div>
            <img src={featuredCard.image_uris?.normal} alt={featuredCard.name} className="card" />
          </div>
        )}
      </div>
    </div>
  );
}
