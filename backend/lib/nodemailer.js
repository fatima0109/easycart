import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS, // Use App Password, not regular password
	},
});

export const sendOTPEmail = async (email, otp) => {
	const mailOptions = {
		from: `"EasyCart" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Verify your EasyCart Account",
		html: `
			<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
				<h2 style="color: #1F2A44;">Welcome to EasyCart!</h2>
				<p>Your verification code is:</p>
				<h1 style="background: #F5F3EF; padding: 10px; display: inline-block; letter-spacing: 5px; color: #1F2A44;">${otp}</h1>
				<p>This code will expire in 10 minutes.</p>
			</div>
		`,
	};

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response); // Verify this in terminal
        return info;
    } catch (error) {
        console.error("NODEMAILER ERROR:", error); // This will tell us why it's failing
        throw error;
    }

	return transporter.sendMail(mailOptions);
};