import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = ({ screeningData }) => {
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

  const handleIngredientsClick = () => {
    navigate('/ingredients');
  };

  // make list of screening data which is an object 0 = first screening, 1 = second screening, etc.
  const screenings = screeningData ? Object.values(screeningData) : [];

  return (
    <div style={{ height: '100vh' }}>
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="dashboard-titles">
            <h1 id='screenings-title'>Screenings</h1>
            <span className="slash">/</span>
            <button
              className="ingredients-nav-button"
              onClick={handleIngredientsClick}
            >
              Ingredients
            </button>
          </div>
          <button
            className="new-screening-button"
            onClick={handleNewScreening}
          >
            New Screening
          </button>
        </div>

        {screenings.length === 0 ? (
          <tbody style={{ textAlign: 'center' }}>
            <tr>
              <td colSpan="4" className="no-screenings-message">No screenings associated with your account</td>
            </tr>
          </tbody>
        ) : (

          <div className="screenings-table-container">
            <table className="screenings-table">
              <thead className='screenings-table-header'>
                <tr>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Last Modified</th>
                  <th>Status</th>
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
                    <td className="status-cell">
                      <div className="status-indicator" title={screening.json?.status ? "Ready to submit" : "Missing required fields or todo items"}>
                        <div className={`status-dot ${screening.json?.status ? 'status-complete' : 'status-incomplete'}`}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 