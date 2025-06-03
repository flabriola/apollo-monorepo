import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScreeningPage from './components/ScreeningPage';
import Ingredients from './components/Ingredients';
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
  const [screeningData, setScreeningData] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [isScreeningDirty, setIsScreeningDirty] = useState(false);

  // fetch functions upon user login
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

    const loadScreeningData = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/screenings/${user.username}`;
        fetch(API_URL)
          .then((res) => res.json())
          .then((data) => setScreeningData(data))
          .catch((err) => console.error('API Error:', err));
      } catch (err) {
        console.error('Failed to fetch screening data', err);
        setScreeningData(null);
      }
    };

    const loadIngredientData = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/ingredients`;
        fetch(API_URL)
          .then((res) => res.json())
          .then((data) => setIngredients(data))
          .catch((err) => console.error('API Error:', err));
      } catch (err) {
        console.error('Failed to fetch ingredient data', err);
        setIngredients(null);
      }
    };

    loadAttributes();
    loadScreeningData();
    loadIngredientData();
  }, [user]);

  // useEffect(() => {
  //   if (!user && authUser) {
  //     setUser(authUser);
  //   }
  // }, [authUser]);

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
              <Header signOut={signOut} user={authUser} userAttributes={userAttributes} isScreeningDirty={isScreeningDirty} setIsScreeningDirty={setIsScreeningDirty} />
              <Routes>
                <Route path="/" element={<Dashboard screeningData={screeningData} />} />
                <Route path="/dashboard" element={<Dashboard screeningData={screeningData} />} />
                <Route path="/screening" element={<ScreeningPage user={authUser} userAttributes={userAttributes} ingredients={ingredients} isScreeningDirty={isScreeningDirty} setIsScreeningDirty={setIsScreeningDirty} />} />
                <Route path="/ingredients" element={<Ingredients ingredients={ingredients} />} />
              </Routes>
            </div>
          </Router>
        );
      }}
    </Authenticator>
  );
}

export default App;
