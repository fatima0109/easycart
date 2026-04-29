import { create } from "zustand";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set) => ({
	orders: [],      // For Admin
	userOrders: [],  // For the logged-in User
	loading: false,
	selectedOrder: null, // Track the order for the modal

	// FOR ADMIN: Get everything
	fetchAllOrders: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/orders/all");
			set({ orders: response.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error("Failed to fetch admin orders");
		}
	},

	// FOR USER: Get only their orders
	fetchUserOrders: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/orders"); // This hits your getUserOrders controller
			set({ userOrders: response.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error("Failed to fetch your orders");
		}
	},

	updateStatus: async (orderId, newStatus) => {
		try {
			const response = await axios.put(`/orders/${orderId}`, { status: newStatus });
			set((state) => ({
				orders: state.orders.map((o) => o._id === orderId ? { ...o, status: response.data.status } : o),
			}));
			toast.success("Status updated");
		} catch (error) {
			toast.error("Failed to update status");
		}
	},

	setSelectedOrder: (order) => set({ selectedOrder: order }),
	closeModal: () => set({ selectedOrder: null }),
}));