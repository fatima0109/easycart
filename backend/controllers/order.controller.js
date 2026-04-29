import Order from "../models/order.model.js";

// @desc    Create new order (Direct Checkout - Replaces Stripe)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
	try {
		const { products, totalAmount } = req.body;

		if (!products || products.length === 0) {
			return res.status(400).json({ message: "No products provided" });
		}

		const newOrder = new Order({
			user: req.user._id,
			products: products.map((p) => ({
				product: p._id,
				quantity: p.quantity,
				price: p.price,
			})),
			totalAmount,
			status: "Processing", // Default status for Admin to see
		});

		const savedOrder = await newOrder.save();

		// Clear user's cart in Database
		req.user.cartItems = [];
		await req.user.save();

		res.status(201).json(savedOrder);
	} catch (error) {
		console.error("Error in createOrder:", error);
		res.status(500).json({ message: "Error creating order", error: error.message });
	}
};

// For Customers: View their own orders
export const getUserOrders = async (req, res) => {
	try {
		// FIX: Added .populate here so the customer can see product names and images
		const orders = await Order.find({ user: req.user._id })
			.populate("products.product", "name image") 
			.sort("-createdAt");
            
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// For Admins: View ALL orders from all users
export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find({})
			.populate("user", "name email")
			.populate("products.product", "name image") // Correctly populated
			.sort("-createdAt");
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// For Admins: Update status (Processing -> Shipped -> Delivered)
export const updateOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate("products.product", "name image");

		if (!order) return res.status(404).json({ message: "Order not found" });

		res.json(order);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};