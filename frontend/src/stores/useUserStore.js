// frontend/src/stores/useUserStore.js
import { create } from "zustand";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			toast.error("Passwords do not match");
			return false;
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password });
			set({ loading: false });
			toast.success(res.data.message || "OTP sent to your email!");
			return true; // Return true to tell the component to show OTP field
		} catch (error) {
			set({ loading: false });
			const message = error.response?.data?.message || "An error occurred during signup";
			toast.error(message);
			return false;
		}
	},

	verifyOTP: async (email, otp) => {
		set({ loading: true });
		try {
			const res = await axios.post("/auth/verify-otp", { email, otp });
			// SUCCESS: Now the user is actually logged in and state is updated
			set({ user: res.data, loading: false });
			toast.success("Account verified successfully!");
			return true;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Invalid or expired OTP");
			return false;
		}
	},

	login: async (email, password) => {
		set({ loading: true });
		try {
			const res = await axios.post("/auth/login", { email, password });
			set({ user: res.data, loading: false });
			toast.success("Welcome back!");
		} catch (error) {
			set({ loading: false });
			toast.error(error?.response?.data?.message || "Invalid credentials");
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
			toast.success("Logged out successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);