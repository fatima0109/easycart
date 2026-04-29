// backend/controllers/cart.controller.js
import Product from "../models/product.model.js";

// 1. Get products in cart (combines Product details + Cart quantities)
export const getCartProducts = async (req, res) => {
	try {
		// Extract only the product IDs from the user's cart objects
		const productIds = req.user.cartItems.map((item) => item.product);
		
		// Find all product documents that match those IDs
		const products = await Product.find({ _id: { $in: productIds } });

		// Combine product data with the specific quantity stored in the user document
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.product.equals(product._id));
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 2. Add to cart (handles incrementing quantity vs. adding new item)
export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		// Check if product already exists in user's cart using .equals() for ObjectIDs
		const existingItem = user.cartItems.find((item) => item.product.equals(productId));
		
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			// CRITICAL: Push as an OBJECT to match the schema { product: ID, quantity: Number }
			user.cartItems.push({ product: productId, quantity: 1 });
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 3. Remove product(s) from cart
export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			user.cartItems = []; // Clear the whole cart
		} else {
			// Filter items by comparing ObjectIDs using .equals()
			user.cartItems = user.cartItems.filter((item) => !item.product.equals(productId));
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in removeAllFromCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 4. Update quantity (Triggered by + or - buttons on frontend)
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.product.equals(productId));

		if (existingItem) {
			if (quantity === 0) {
				// Remove item entirely if quantity is reduced to 0
				user.cartItems = user.cartItems.filter((item) => !item.product.equals(productId));
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found in cart" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};