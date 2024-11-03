import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import News from './components/Newsapp'; // Import the News component (create this component to display after login)

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/Newsapp" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />
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
