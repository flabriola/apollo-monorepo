import React from 'react';
import '../styles/Header.css';
import Logo from '../assets/logo.svg';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={Logo} alt="Apollo Guide" className="header-logo" />
      </div>
    </header>
  );
};

export default Header; 