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
    console.log('MMMMMM');
    fetch('http://apollo-guide-backend-env.eba-t3phmm4a.eu-north-1.elasticbeanstalk.com/api/restaurants')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
  
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/screening" element={<ScreeningPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
