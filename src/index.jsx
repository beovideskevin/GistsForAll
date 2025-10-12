import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import axios from "axios";
axios.defaults.baseURL = "https://api.github.com/";
axios.defaults.headers.common['Accept'] = `application/vnd.github+json`;
axios.defaults.headers.common['X-GitHub-Api-Version'] = `2022-11-28`;

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(
    <App />
);
