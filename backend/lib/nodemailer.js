import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Mandatory for free tier
            to: email, 
            subject: 'Verify your EasyCart Account',
            html: `<h1>Your verification code is: ${otp}</h1>`,
        });
        console.log("Email sent via Resend API successfully");
    } catch (error) {
        console.error("RESEND ERROR:", error.message);
        // Backup for demo: always log the OTP
        console.log("!!! DEMO CODE (Copy this if email fails):", otp);
    }
};