import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../lib/nodemailer.js";

// --- HELPERS ---

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
    // Standard Redis syntax: "EX" followed by seconds
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); 
};

const setCookies = (res, accessToken, refreshToken) => {
    // IMPORTANT: For Vercel (Frontend) and Render (Backend) to work, 
    // you MUST use sameSite: "none" and secure: true
    const cookieOptions = {
        httpOnly: true,
        secure: true, // Must be true for sameSite: "none"
        sameSite: "none", // Required for cross-domain cookies
    };

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

// --- CONTROLLERS ---

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be 8+ chars with uppercase, lowercase, number, and special char." 
            });
        }

        const lowerCaseEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ email: lowerCaseEmail });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        const tempData = JSON.stringify({ name, email: lowerCaseEmail, password: hashedPassword, otp });
        // Use standard "EX" syntax
        await redis.set(`tempUser:${lowerCaseEmail}`, tempData, "EX", 600); 

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

        const cachedData = await redis.get(`tempUser:${lowerCaseEmail}`);

        if (!cachedData) {
            return res.status(400).json({ message: "OTP expired. Please sign up again." });
        }

        const { name, password: hashedPassword, otp: storedOtp } = JSON.parse(cachedData);

        if (otp !== storedOtp) {
            return res.status(400).json({ message: "Invalid OTP code" });
        }

        // Create User
        const user = await User.create({
            name,
            email: lowerCaseEmail,
            password: hashedPassword,
        });

        // Use Helper functions (Don't write JWT logic twice!)
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        // Cleanup Redis
        await redis.del(`tempUser:${lowerCaseEmail}`);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, 
        });
    } catch (error) {
        console.error("Error in verifyOTP:", error.message);
        res.status(500).json({ message: "Server error during verification" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim() });

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
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                await redis.del(`refresh_token:${decoded.userId}`);
            } catch (err) {
                // Token might be expired, just proceed to clear cookies
            }
        }

        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
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
        // req.user is usually populated by a "protectRoute" middleware
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};