import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const sendOTPEmail = async (email, otp) => {
    const data = {
        sender: { name: "EasyCart", email: process.env.SENDER_EMAIL },
        to: [{ email: email }],
        subject: "Verify your EasyCart Account",
        htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #1F2A44;">Welcome to EasyCart!</h2>
                <p>Your verification code is:</p>
                <h1 style="background: #F5F3EF; padding: 10px; display: inline-block; letter-spacing: 5px; color: #1F2A44;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
            </div>
        `
    };

    try {
        await axios.post('https://api.brevo.com/v3/smtp/email', data, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log("SUCCESS: Email delivered via Brevo API");
    } catch (error) {
        console.error("BREVO ERROR:", error.response ? error.response.data : error.message);
        // Backup for demo
        console.log("!!! OTP FOR DEMO:", otp);
    }
};