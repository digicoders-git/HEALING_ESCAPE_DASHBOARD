// src/apis/http.js
import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token for every request
http.interceptors.request.use((config) => {
  let token = localStorage.getItem("admin-token");
  
  // For development - create a temporary token if none exists
  if (!token) {
    token = 'temp-dev-token';
    localStorage.setItem('admin-token', token);
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
