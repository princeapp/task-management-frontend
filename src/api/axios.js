// api/axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/', // Set your API base URL here
  headers: {
    'Content-Type': 'application/json',
    // Add any custom headers if needed
  },
});

// Add request interceptor to include bearer token for authenticated requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(config => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  });
  

export default instance;
