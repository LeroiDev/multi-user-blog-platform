import axios from "axios";
import { getToken } from "../stores/authStore";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach JWT from store’s static helper
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
