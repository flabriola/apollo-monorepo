import React from 'react';
import { useNavigate } from 'react-router-dom';
import { screenings } from '../data/mockData';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleScreeningClick = (screening) => {
    navigate('/screening', { state: { screening } });
  };

  const handleNewScreening = () => {
    navigate('/screening');
  };

  return (
    <div style={{ backgroundColor: '#f5f5f7', height: '100vh' }}>
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 id='screenings-title'>Screenings</h1>
        <button 
          className="new-screening-button"
          onClick={handleNewScreening}
        >
          New Screening
        </button>
      </div>
      
      <div className="screenings-table-container">
        <table className="screenings-table">
          <thead className='screenings-table-header'>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {screenings.map((screening) => (
              <tr
                key={screening.id}
                className="screening-row"
                onClick={() => handleScreeningClick(screening)}
              >
                <td>{screening.title}</td>
                <td>{screening.owner}</td>
                <td>{formatDate(screening.lastModified)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default Dashboard; 