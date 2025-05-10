import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScreeningPage from './components/ScreeningPage';
import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/restaurants`)
      .then(res => res.json())
      .then(data => {
        console.log(data); // for debugging
        setRestaurants(data.restaurants);
      })
      .catch(err => console.error('Error fetching:', err));
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/screening" element={<ScreeningPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
