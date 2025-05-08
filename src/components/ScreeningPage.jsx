import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ScreeningPage.css';

const ScreeningPage = () => {
  const location = useLocation();
  const screening = location.state?.screening;

  return (
    <div className="screening-page">
      <div className="screening-page-header">
        <h1>{screening ? `Editing: ${screening.title}` : 'New Screening'}</h1>
      </div>
      <div className="screening-page-content">
        {screening ? (
          <div className="screening-details">
            <p>ID: {screening.id}</p>
            <p>Owner: {screening.owner}</p>
            <p>Last Modified: {new Date(screening.lastModified).toLocaleString()}</p>
            {/* You will implement the full editor here later */}
          </div>
        ) : (
          <p>This is a new screening. Editor will be implemented later.</p>
        )}
      </div>
    </div>
  );
};

export default ScreeningPage; 