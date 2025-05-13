import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import Logo from '../assets/logo.svg';

const Header = ({ signOut, user, userAttributes }) => {

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/">
          <img src={Logo} alt="Apollo Guide" className="header-logo" />
        </Link>
        <div className="header-links">
          {user && (
            <>
              <span className="user-greeting">{userAttributes?.name} {userAttributes?.family_name}</span>
              <a href="#" onClick={signOut}>Sign Out</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 