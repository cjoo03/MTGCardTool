// src/components/NavigationBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/navigationBar.css'; // Add your styles for the navigation bar

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/commander">Commander Discovery</Link></li>
        <li><Link to="/collection">Collection</Link></li>
        <li><Link to="/random">Random Card</Link></li>
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
};

export default NavigationBar;
