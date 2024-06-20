import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RandomCardPage from './pages/RandomCard';
import CollectionPage from './pages/Collection';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/random" element={<RandomCardPage />} />
          {/* <Route path="*" element={<noPage />} /> */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
