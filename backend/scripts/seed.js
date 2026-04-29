import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

dotenv.config();

const categories = [
	{ name: "Jewellery", href: "jewellery", description: "Elegant pieces", imageUrl: "/jewellery.jpg" },
	{ name: "Gaming Setup", href: "gaming", description: "High-end gear", imageUrl: "/gaming.jpeg" },
	{ name: "Kitchen Essentials", href: "kitchen", description: "Chef quality", imageUrl: "/kitchen.jpeg" },
	{ name: "Modern Fashion", href: "fashion", description: "Latest trends", imageUrl: "/fashion.jpg" },
	{ name: "Home Appliances", href: "appliances", description: "Smart home", imageUrl: "/appliances.jpeg" },
	{ name: "Electronics", href: "electronics", description: "Gadgets", imageUrl: "/electronics.jpeg" },
];

async function seed() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB...");

		// 1. Delete old data
		await Category.deleteMany({});
		await Product.deleteMany({});
		console.log("Deleted old categories and products.");

		// 2. Insert new categories
		await Category.insertMany(categories);
		console.log("✅ 6 Categories seeded successfully.");

		// 3. Optional: Insert one test product so the store isn't empty
		await Product.create({
			name: "Modern Fashion Essentials",
			description: "Versatile pieces that define your personal style.",
			price: 129.99,
			image: "/fashion.jpg",
			category: "fashion",
			isFeatured: true,
		});
		console.log("✅ Test product seeded.");

		process.exit(0);
	} catch (error) {
		console.error("❌ Seeding failed:", error.message);
		process.exit(1);
	}
}

seed();