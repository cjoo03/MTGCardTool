import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, sortOrder, setSortOrder, sortDir, setSortDir, handleSearch }) => {
  return (
    <div className="search-container">
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search for cards" 
        className="search-input"
      />
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="search-select">
        <option value="name">Name</option>
        <option value="set">Set</option>
        <option value="released">Release Date</option>
        <option value="rarity">Rarity</option>
        <option value="usd">Price (USD)</option>
        <option value="eur">Price (EUR)</option>
      </select>
      <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} className="search-select">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button onClick={handleSearch} className="search-button">Search</button>
    </div>
  );
};

export default SearchBar;
