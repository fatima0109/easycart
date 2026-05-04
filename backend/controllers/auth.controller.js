import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
    // Upstash requires an object { ex: seconds } for expiration
	await redis.set(`refresh_token:${userId}`, refreshToken, { ex: 604800 }); // 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, 
		secure: true, // Must be true for cross-site cookies
		sameSite: "none", // REQUIRED for Vercel -> Render communication
		maxAge: 15 * 60 * 1000, 
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, 
		secure: true, 
		sameSite: "none", // REQUIRED for Vercel -> Render communication
		maxAge: 7 * 24 * 60 * 60 * 1000, 
	});
};

export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		console.log("1. Signup request received for:", email);

		// --- PASSWORD VALIDATION ---
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(password)) {
			return res.status(400).json({ 
				message: "Password security requirement not met: Must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character." 
			});
		}

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		// --- HARDCODED ADMIN LOGIC ---
		// Define your master admin email here
		const MASTER_ADMIN_EMAIL = "usertest9644@gmail.com"; 

		// If the signing up email matches exactly, they become admin. Otherwise, customer.
		const role = email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() ? "admin" : "customer";
		// -----------------------------

		console.log(`2. Creating user as ${role}...`);
		const user = await User.create({ name, email, password, role });

		console.log("3. Generating tokens...");
		let tokens;
		try {
			tokens = generateTokens(user._id);
		} catch (jwtError) {
			console.error("JWT ERROR:", jwtError.message);
			return res.status(500).json({ message: "JWT Secret keys are missing in .env file" });
		}

		await storeRefreshToken(user._id, tokens.refreshToken);
		setCookies(res, tokens.accessToken, tokens.refreshToken);

		console.log("6. Signup successful!");
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});

	} catch (error) {
		console.error("FULL SIGNUP ERROR:", error);
		res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role, 
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "none",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};