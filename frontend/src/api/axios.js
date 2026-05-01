import axios from "axios";

const axiosInstance = axios.create({
    // If we are on our computer, use localhost.
    // If we are on the internet, use the variable we set in Vercel.
	baseURL: import.meta.env.MODE === "development" 
        ? "http://localhost:5000/api" 
        : import.meta.env.VITE_API_URL,
	withCredentials: true, 
});

export default axiosInstance;