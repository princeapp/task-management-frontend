import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css'; // Import your global styles here
import App from './App'; // Import the root component of your application
//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Mount your root component to the 'root' element in index.html
);

// If you want to measure performance in your app, pass a function to log results
//reportWebVitals();
