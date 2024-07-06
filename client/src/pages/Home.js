import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Welcome to MTG Card Collection Tracker</h1>
      <p>This is your ultimate tool for managing and tracking your Magic: The Gathering card collection.</p>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/commander">Commander Discovery</Link>
          </li>
          <li>
            <Link to="/collection">Collection</Link>
          </li>
          <li>
            <Link to="/random">Random Card</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
