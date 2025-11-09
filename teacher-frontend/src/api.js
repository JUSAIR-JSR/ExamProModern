import axios from "axios";
import { safeStorage } from "./safeStorage"; // ✅ import added

const API = axios.create({
  baseURL: "https://exampromodern-backend-pj8p.onrender.com/api",
});

// ✅ Automatically include token if logged in
API.interceptors.request.use((config) => {
  const token = safeStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
