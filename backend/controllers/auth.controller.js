import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../lib/nodemailer.js";

// --- HELPERS (Logic Re-use) ---

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
	// Standard Redis v4 syntax: { EX: seconds }
	await redis.set(`refresh_token:${userId}`, refreshToken, { EX: 7 * 24 * 60 * 60 });
};

const setCookies = (res, accessToken, refreshToken) => {
	const cookieOptions = {
		httpOnly: true, // prevents XSS attacks
		secure: true,   // required for sameSite: "none"
		sameSite: "none", // allows cross-domain cookies (Vercel to Render)
	};

	res.cookie("accessToken", accessToken, {
		...cookieOptions,
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		...cookieOptions,
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
				message: "Password must be 8+ chars with uppercase, lowercase, number, and special char.",
			});
		}

		const lowerCaseEmail = email.toLowerCase().trim();

		// 2. Check if user already exists
		const userExists = await User.findOne({ email: lowerCaseEmail });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		// 3. Setup OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		/**
		 * NOTE: We store the PLAIN password in Redis temporarily.
		 * The hashing will happen automatically in the User.model 'pre-save' hook
		 * when we call User.create() in the verifyOTP step.
		 */
		const tempData = JSON.stringify({ name, email: lowerCaseEmail, password, otp });
		await redis.set(`tempUser:${lowerCaseEmail}`, tempData, { EX: 600 }); // 10 minute expiry

		// 4. Send Mail
		await sendOTPEmail(lowerCaseEmail, otp);

		res.status(200).json({ message: "OTP sent to your email. Please verify within 10 minutes." });
	} catch (error) {
		console.error("Signup Error:", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const verifyOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;
		const lowerCaseEmail = email.toLowerCase().trim();

		// 1. Get from Redis
		const cachedData = await redis.get(`tempUser:${lowerCaseEmail}`);
		if (!cachedData) {
			return res.status(400).json({ message: "OTP expired or not found. Please sign up again." });
		}

		/**
		 * FIX: Check if cachedData is a string or already an object.
		 * This prevents the "[object Object] is not valid JSON" error.
		 */
		const parsedData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
		const { name, password, otp: storedOtp } = parsedData;

		// 2. Compare OTP
		if (otp !== storedOtp) {
			return res.status(400).json({ message: "Invalid OTP code" });
		}

		// 3. Create actual user in MongoDB
		// This triggers the pre-save hook in your model to hash the password correctly.
		const user = await User.create({
			name,
			email: lowerCaseEmail,
			password,
		});

		// 4. Log them in (Tokens & Cookies)
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);
		setCookies(res, accessToken, refreshToken);

		// 5. Cleanup Redis
		await redis.del(`tempUser:${lowerCaseEmail}`);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.error("VerifyOTP Error:", error.message);
		res.status(500).json({ message: "Server error during verification" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const lowerCaseEmail = email.toLowerCase().trim();
		const user = await User.findOne({ email: lowerCaseEmail });

		// Uses the .comparePassword method from your user.model.js
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
		console.error("Login Error:", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			try {
				const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
				await redis.del(`refresh_token:${decoded.userId}`);
			} catch (err) {
				// Proceed if token is invalid/expired
			}
		}

		const clearOptions = { httpOnly: true, secure: true, sameSite: "none" };
		res.clearCookie("accessToken", clearOptions);
		res.clearCookie("refreshToken", clearOptions);
		
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Logout Error:", error.message);
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
		console.error("RefreshToken Error:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		// req.user is populated by your protectRoute middleware
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};