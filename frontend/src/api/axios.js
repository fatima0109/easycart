import axios from "axios";

const axiosInstance = axios.create({
    // Changed .mode to .env.MODE
    // Also, point to 5173 (the proxy) instead of 5000 directly to avoid CORS issues
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5173/api" : "/api",
	withCredentials: true, 
});

export default axiosInstance;