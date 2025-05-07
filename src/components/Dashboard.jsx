import React from 'react';
import './Dashboard.css';

// Mock data - this will be replaced with actual data from the database later
const mockScreenings = [
  {
    id: 1,
    title: "Joe's Pizza - Menu Screening",
    lastModified: "2024-03-20T10:30:00",
    owner: "John Doe"
  },
  {
    id: 2,
    title: "Sushi Master - Menu Review",
    lastModified: "2024-03-19T15:45:00",
    owner: "Jane Smith"
  },
  {
    id: 3,
    title: "Burger Palace - Menu Analysis",
    lastModified: "2024-03-18T09:15:00",
    owner: "Mike Johnson"
  }
];

const Dashboard = () => {
  const handleScreeningClick = (id) => {
    // This will be implemented later to navigate to the screening page
    console.log(`Navigating to screening ${id}`);
  };

  const handleNewScreening = () => {
    // This will be implemented later to create a new screening
    console.log('Creating new screening');
  };

  return (
    <div className="dashboard-root">
      <header className="ag-header">
        <div className="container">
          <span className="ag-title">Apollo Guide</span>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header-row">
            <h1 className="dashboard-title">Menu Screenings</h1>
            <button className="new-screening-btn" onClick={handleNewScreening}>
              + New Screening
            </button>
          </div>
          
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Last Modified</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {mockScreenings.map((screening) => (
                  <tr
                    key={screening.id}
                    className="dashboard-table-row"
                    onClick={() => handleScreeningClick(screening.id)}
                  >
                    <td>{screening.title}</td>
                    <td>{new Date(screening.lastModified).toLocaleDateString()}</td>
                    <td>{screening.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 