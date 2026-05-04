import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../lib/nodemailer.js";

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
	await redis.set(`refresh_token:${userId}`, refreshToken, { ex: 604800 }); // 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, 
		secure: true, 
		sameSite: "none", 
		maxAge: 15 * 60 * 1000, 
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, 
		secure: true, 
		sameSite: "none", 
		maxAge: 7 * 24 * 60 * 60 * 1000, 
	});
};

// --- CONTROLLERS ---

export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		// 1. Password Validation
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(password)) {
			return res.status(400).json({ 
				message: "Password must be 8+ chars with uppercase, lowercase, number, and special char." 
			});
		}

		// 2. Check if user already exists in MongoDB
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		// 3. Generate 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// 4. Store user data temporarily in Redis for 10 minutes
		const tempData = JSON.stringify({ name, email, password, otp });
		await redis.set(`temp-user:${email}`, tempData, { ex: 600 }); 

		// 5. Send the OTP via Email
		await sendOTPEmail(email, otp);

		res.status(200).json({ message: "OTP sent to your email. Please verify within 10 minutes." });

	} catch (error) {
		console.error("Signup Error:", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const verifyOTP = async (req, res) => {
	const { email, otp } = req.body;
	try {
		// 1. Get data from Redis
		const data = await redis.get(`temp-user:${email}`);
		if (!data) return res.status(400).json({ message: "OTP expired or invalid session" });

		const { name, password, otp: storedOtp } = JSON.parse(data);

		// 2. Validate OTP
		if (otp !== storedOtp) {
			return res.status(400).json({ message: "Incorrect OTP code" });
		}

		// 3. Hardcoded Admin Logic
		// Use your admin email: usertest9644@gmail.com
		const MASTER_ADMIN_EMAIL = "usertest9644@gmail.com"; 
		const role = email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() ? "admin" : "customer";

		// 4. Create actual user in MongoDB
		const user = await User.create({ name, email, password, role });

		// 5. Generate Access & Refresh Tokens
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);
		setCookies(res, accessToken, refreshToken);

		// 6. Clean up Redis (remove temp data)
		await redis.del(`temp-user:${email}`);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});

	} catch (error) {
		console.error("Verify OTP Error:", error.message);
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
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) return res.status(401).json({ message: "Invalid refresh token" });

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
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