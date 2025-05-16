import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import Logo from '../assets/logo.svg';

const Header = ({ signOut, user, userAttributes, isScreeningDirty, setIsScreeningDirty }) => {
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    e.preventDefault();
    
    if (isScreeningDirty) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave without saving?');
      if (!confirmLeave) return;
      setIsScreeningDirty(false);
    }
    
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <a href="/" onClick={handleNavigation}>
          <img src={Logo} alt="Apollo Guide" className="header-logo" />
        </a>
        <div className="header-links">
          {user && (
            <>
              <span className="user-greeting">{userAttributes?.name} {userAttributes?.family_name}</span>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                
                if (isScreeningDirty) {
                  const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave without saving?');
                  if (!confirmLeave) return;
                  setIsScreeningDirty(false);
                }
                signOut();
              }}>Sign Out</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 