import axios from "axios";
import { safeStorage } from "./safeStorage";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://exampromodern-backend-pj8p.onrender.com/api",
});

// Attach token
API.interceptors.request.use((config) => {
  const token = safeStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminGoogleLogin = (data) =>
  API.post("/admin/google-login", data);

export default API;
