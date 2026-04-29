import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Main function to get KPI stats (Users, Products, etc.)
export const getAnalyticsData = async () => {
	const totalUsers = await User.countDocuments();
	const totalProducts = await Product.countDocuments();

	const salesData = await Order.aggregate([
		{
			$group: {
				_id: null, // groups everything together
				totalSales: { $sum: 1 },
				totalRevenue: { $sum: "$totalAmount" },
			},
		},
	]);

	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
};

// The function your route is looking for!
export const getDailySalesData = async (startDate, endDate) => {
	try {
		const dailySalesData = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		// Format data for Recharts (Frontend)
		const dateArray = getDatesInRange(startDate, endDate);

		return dateArray.map((date) => {
			const found = dailySalesData.find((item) => item._id === date);
			return {
				date,
				sales: found ? found.sales : 0,
				revenue: found ? found.revenue : 0,
			};
		});
	} catch (error) {
		throw error;
	}
};

// Helper function
function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currDate = new Date(startDate);
	while (currDate <= endDate) {
		dates.push(currDate.toISOString().split("T")[0]);
		currDate.setDate(currDate.getDate() + 1);
	}
	return dates;
}