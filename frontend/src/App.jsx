/**
 * @file App.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/App.jsx
 * @description Root component with React Router configuration.
 * Handles navigation between HomePage, LoginPage, and SignupPage.
 * Will be expanded to include protected routes and authentication state management.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
// import LoadingDemo from './components/common/LoadingDemo'; // Keep for reference - DO NOT USE IN PRODUCTION
import './index.css'; // Ensure global styles and Tailwind are imported

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/demo" element={<LoadingDemo />} /> */} {/* REFERENCE ONLY - Uncomment for LoadingSpinner demos */}
        {/* TODO: Add more routes like dashboard, profile, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
