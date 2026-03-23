import axios from "axios";

// Vite uses import.meta.env instead of process.env
export const API_URL ="http://localhost:8080";
console.log("API URL from environment variable :", API_URL);
export const api = axios.create({
    baseURL: API_URL, 
    headers: {
        "Content-Type": "application/json",
    },
});