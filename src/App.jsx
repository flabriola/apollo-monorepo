import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScreeningPage from './components/ScreeningPage';
import './App.css';
import './styles/Auth.css';
import awsExports from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes } from 'aws-amplify/auth';
import Logo from './assets/logo.svg';

Amplify.configure(awsExports);

function App() {
  const [user, setUser] = useState(null);
  const [userAttributes, setUserAttributes] = useState(null);

  // fetch restaurant data once
  useEffect(() => {
    const API_URL = `${import.meta.env.VITE_API_URL}/restaurants`;
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => console.log('Restaurant data:', data))
      .catch((err) => console.error('API Error:', err));
  }, []);

  // fetch attributes when user is set
  useEffect(() => {
    if (!user) return;
    const loadAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
      } catch (err) {
        console.error('Failed to fetch user attributes', err);
        setUserAttributes(null);
      }
    };
    loadAttributes();
  }, [user]);

  return (
    <Authenticator
      hideSignUp
      components={{
        SignUp: () => null,
        Header() {
          return (
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <img src={Logo} alt="Logo" style={{ height: 50 }} />
            </div>
          );
        },
      }}
    >
      {({ signOut, user: authUser }) => {
        // only update state if the user is new
        if (!user && authUser) setUser(authUser);

        return (
          <Router>
            <div className="app">
              <Header signOut={signOut} user={authUser} userAttributes={userAttributes} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/screening" element={<ScreeningPage />} />
              </Routes>
            </div>
          </Router>
        );
      }}
    </Authenticator>
  );
}

export default App;
