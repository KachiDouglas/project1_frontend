import axios from 'axios';

const API_HOST = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

export default api;
