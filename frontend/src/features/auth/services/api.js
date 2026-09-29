import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.message || (error?.response ? fallback : "Cannot reach the server. Check that it is running.");