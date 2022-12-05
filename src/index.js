import React from 'react';
import ReactDOM from 'react-dom/client';
// import {Routes, Route} from "react-router-dom"
import {BrowserRouter} from "react-router-dom";
import './scss/index.scss';
import App from './js/App.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);



root.render(
  // ThemeProvider required theme to be specified 
  // <React.StrictMode>
  <div>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Heebo"></link>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </div>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
