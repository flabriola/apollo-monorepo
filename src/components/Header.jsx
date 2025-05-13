import React from 'react';
import '../styles/Header.css';
import Logo from '../assets/logo.svg';

const Header = ({ signOut, user }) => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={Logo} alt="Apollo Guide" className="header-logo" />
        <div className="header-links">
          {user && (
            <>
              <span className="user-greeting">{user.username}</span>
              <a href="#" onClick={signOut}>Sign Out</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 