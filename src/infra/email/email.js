import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.EMAIL_HOST, // ex: smtp.zoho.com
  port: process.env.EMAIL_PORT, // ex: 587
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // email
    pass: process.env.EMAIL_PASS, // senha do email
  },
});

export default transporter;
