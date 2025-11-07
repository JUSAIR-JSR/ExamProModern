import axios from "axios";

const API = axios.create({
  baseURL: "https://exampromodern-backend-pj8p.onrender.com/api",
});

// Automatically add token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
