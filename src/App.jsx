import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScreeningPage from './components/ScreeningPage';
import './App.css';
import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App() {

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    console.log('MMMMMM');
    const API_URL = `${import.meta.env.VITE_API_URL}/restaurants`;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error('Error:', err));


  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="app">
            <Header signOut={signOut} user={user} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/screening" element={<ScreeningPage />} />
            </Routes>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
