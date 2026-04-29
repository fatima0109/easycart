import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

// 1. Fetch All Products (Admin view)
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 2. UNIVERSAL FILTER: Handles Search, Category, and Price Range simultaneously
export const getFilteredProducts = async (req, res) => {
	try {
		const { search, category, minPrice, maxPrice } = req.query;
		let query = {};

		// Search logic: Regex for partial matches, case-insensitive
		if (search) {
			query.name = { $regex: search, $options: "i" };
		}

		// Category logic: Only apply if a specific category is chosen
		if (category && category !== "all") {
			query.category = category;
		}

		// Price range logic: $gte (Greater than or equal), $lte (Less than or equal)
		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number(minPrice);
			if (maxPrice) query.price.$lte = Number(maxPrice);
		}

		// Fetch products, sort by newest first, use lean() for performance
		const products = await Product.find(query).sort("-createdAt").lean();
		
		res.json({ products });
	} catch (error) {
		console.log("Error in getFilteredProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 3. Category Specific Fetch (Legacy Support for category pages)
export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category }).lean();
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 4. Featured Products (With Redis Caching)
export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));
		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 5. Create Product (Cloudinary Integration)
export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;
		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url || "",
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 6. Delete Product (Cleanup Cloudinary + DB + Redis Cache)
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Delete from Cloudinary
		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
			} catch (error) {
				console.log("error deleting image from cloudinary", error);
			}
		}

		// Delete from MongoDB
		await Product.findByIdAndDelete(req.params.id);

		// !!! THE FIX: If the deleted product was featured, we MUST update the cache !!!
		if (product.isFeatured) {
			await updateFeaturedProductsCache();
		}

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 7. Toggle Featured Status (Admin only)
export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// 8. Recommendations (Random Sampling)
export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);
		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// HELPER: Sync Redis cache with DB
async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}