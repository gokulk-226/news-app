import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import News from './components/Newsapp';

function App() {
  // Get the login state from localStorage on initial load
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    return savedLoginState === 'true'; // If stored as true, user is logged in
  });

  // Handle login state change and store it in localStorage
  const handleLogin = (loginStatus) => {
    setIsLoggedIn(loginStatus);
    localStorage.setItem('isLoggedIn', loginStatus.toString());
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/Newsapp" replace /> : <Login setIsLoggedIn={handleLogin} />
          }
        />
        <Route
          path="/Newsapp"
          element={isLoggedIn ? <News /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
