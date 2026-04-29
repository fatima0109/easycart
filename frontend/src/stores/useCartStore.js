import { create } from "zustand";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},

	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},

	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: Array.isArray(res.data) ? res.data : [] });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			if (error.response?.status !== 401) {
				toast.error(error.response?.data?.message || "An error occurred fetching cart");
			}
		}
	},

	// NEW: Create Order function (Replaces Stripe)
	createOrder: async () => {
		const { cart, total, isCouponApplied, coupon } = get();
		try {
			// Send order details to backend to save in Database for Admin
			await axios.post("/orders", {
				products: cart,
				totalAmount: total,
				couponCode: isCouponApplied ? coupon.code : null,
			});

			// Clear local store
			set({ cart: [], coupon: null, isCouponApplied: false, total: 0, subtotal: 0 });
			return true;
		} catch (error) {
			console.error("Order creation error:", error);
			toast.error(error.response?.data?.message || "Failed to place order");
			return false;
		}
	},

	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},

	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			
			get().calculateTotals();
		} catch (error) {
			toast.error(error?.response?.data?.message || "Please login to add items to cart");
		}
	},

	removeFromCart: async (productId) => {
		try {
			await axios.delete(`/cart`, { data: { productId } });
			set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
			get().calculateTotals();
			toast.success("Item removed from cart");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to remove item");
		}
	},

	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}
		try {
			await axios.put(`/cart/${productId}`, { quantity });
			set((prevState) => ({
				cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
			}));
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update quantity");
		}
	},

	calculateTotals: () => {
		const { cart, coupon } = get();
		if (!Array.isArray(cart) || cart.length === 0) {
			set({ subtotal: 0, total: 0 });
			return;
		}
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;
		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}
		set({ subtotal, total: Math.round(total * 100) / 100 });
	},
}));