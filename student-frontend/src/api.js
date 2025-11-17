import axios from "axios";
import { safeStorage } from "./utils/safeStorage";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://exampromodern-backend-pj8p.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = safeStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
