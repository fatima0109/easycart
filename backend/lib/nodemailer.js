import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // FORCE IPv4 to avoid the Render IPv6 'Network Unreachable' error
    // 'family: 4' is the key here
    family: 4, 
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
});

export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"EasyCart" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your EasyCart Account",
        html: `<h1>Your code: ${otp}</h1>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("NODEMAILER ERROR:", error.message);
        // On Render, sometimes mail fails but we don't want to crash the signup
        // throw error; // Comment this out if you want signup to continue anyway for testing
    }
};