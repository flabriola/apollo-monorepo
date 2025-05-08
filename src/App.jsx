import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScreeningPage from './components/ScreeningPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/screening" element={<ScreeningPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
