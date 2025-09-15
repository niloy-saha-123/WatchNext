/**
 * @file main.jsx
 * @path /frontend/src/main.jsx
 * @description Entry point for the React application. Sets up the root React component
 * with StrictMode for development checks and mounts it to the DOM.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

