import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.service!,
    auth: {
      user: process.env.user!,
      pass: process.env.pass!,
    },
    pool: true,
    maxConnections: 10,
    maxMessages: 100, 
    rateLimit: 10,
  });
};

export { createTransporter };