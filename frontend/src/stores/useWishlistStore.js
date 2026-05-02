import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";

export const useWishlistStore = create(
	persist(
		(set, get) => ({
			wishlist: [],

			toggleWishlist: (product) => {
				const isPresent = get().wishlist.some((item) => item._id === product._id);
				if (isPresent) {
					set((state) => ({
						wishlist: state.wishlist.filter((item) => item._id !== product._id),
					}));
					toast.success("Removed from wishlist");
				} else {
					set((state) => ({ wishlist: [...state.wishlist, product] }));
					toast.success("Added to wishlist");
				}
			},

			removeFromWishlist: (productId) => {
				set((state) => ({
					wishlist: state.wishlist.filter((item) => item._id !== productId),
				}));
			},
		}),
		{ name: "wishlist-storage" } // Saves to local storage so it doesn't disappear on refresh
	)
);