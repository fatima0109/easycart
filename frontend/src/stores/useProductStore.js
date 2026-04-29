// frontend/src/stores/useProductStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../api/axios";

export const useProductStore = create((set) => ({
	products: [],
	featuredProducts: [], // FIX: Added dedicated state for featured products
	loading: false,

	setProducts: (products) => set({ products }),

	// FETCH FILTERED PRODUCTS (Search + Category + Price)
	fetchFilteredProducts: async (filters) => {
		set({ loading: true });
		try {
			const activeFilters = Object.fromEntries(
				Object.entries(filters).filter(([, value]) => 
					value !== "" && value !== null && value !== undefined
				)
			);
			const queryString = new URLSearchParams(activeFilters).toString();
			const response = await axios.get(`/products/filtered?${queryString}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ loading: false });
			const errorMessage = error?.response?.data?.message || "Failed to fetch products";
			toast.error(errorMessage);
		}
	},

	// CREATE PRODUCT
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product created successfully");
		} catch (error) {
			const errorMessage = error?.response?.data?.error || error?.response?.data?.message || "Failed to create product";
			toast.error(errorMessage);
			set({ loading: false });
		}
	},

	// FETCH ALL PRODUCTS (Admin view)
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ loading: false });
			const errorMessage = error?.response?.data?.error || "Failed to fetch inventory";
			toast.error(errorMessage);
		}
	},

	// FETCH PRODUCTS BY CATEGORY
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error("Failed to fetch category items");
		}
	},

	// DELETE PRODUCT
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevState) => ({
				// FIX: Remove from BOTH arrays instantly so no page refresh is needed
				products: prevState.products.filter((product) => product._id !== productId),
				featuredProducts: prevState.featuredProducts.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product removed from inventory");
		} catch (error) {
			set({ loading: false });
			toast.error(error?.response?.data?.error || "Failed to delete product");
		}
	},

	// TOGGLE FEATURED STATUS
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((prevState) => {
				const updatedProducts = prevState.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				);

				// FIX: If we turn OFF feature, remove it from the featured array. 
				// If we turn ON feature, we can't easily add the full object here without a refetch,
				// so we just let the next page load handle fetching the new featured array.
				const updatedFeatured = response.data.isFeatured === false 
					? prevState.featuredProducts.filter(p => p._id !== productId)
					: prevState.featuredProducts;

				return {
					products: updatedProducts,
					featuredProducts: updatedFeatured,
					loading: false,
				};
			});
			toast.success(response.data.isFeatured ? "Product featured" : "Featured status removed");
		} catch (error) {
			set({ loading: false });
			toast.error("Failed to update featured status");
		}
	},

	// FETCH FEATURED PRODUCTS (Homepage carousel)
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			// FIX: Store this in featuredProducts, not products
			set({ featuredProducts: response.data, loading: false });
		} catch (error) {
			set({ loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));