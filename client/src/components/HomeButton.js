import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  let navigate = useNavigate();

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <button onClick={navigateHome} style={{ margin: '20px', padding: '10px' }}>
      Home
    </button>
  );
};

export default HomeButton;
