/**
 * @file App.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/App.jsx
 * @description This is the root component of the React application.
 * For now, it simply renders the HomePage.
 * Later, this file will contain the React Router setup to handle
 * navigation between different pages like HomePage, AuthPage, and DashboardPage.
 */
import React from 'react';
import HomePage from './pages/HomePage';
import './index.css'; // Ensure global styles and Tailwind are imported

function App() {
  // The root component returns the main HomePage.
  // This will be replaced by the router logic later.
  return (
    <HomePage />
  );
}

export default App;
