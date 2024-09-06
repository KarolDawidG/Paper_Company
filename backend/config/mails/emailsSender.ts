import dotenv from "dotenv";
import { createTransporter } from "./configs/nodemoailerConfig";
dotenv.config();

const sendResetPasswordEmail = async (
  email: string,
  username: string,
  link: string,
) => {
  if (!process.env.user) {
    throw new Error("Environment variable 'user' is not set");
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.user,
    to: email,
    subject: `Password Reset Request`,
    html: `
    <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
      <h2 style="color: #3b5998; font-size: 24px;">Hello ${username},</h2>
      <p style="color: #444; font-size: 16px;">We have received a request to reset your password. Please click on the button below to reset your password:</p>
      <a href="${link}" style="display: inline-block; background-color: #3b5998; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 18px; margin-bottom: 20px;">Reset Password</a>
      <p style="color: #777; font-size: 14px;">If you did not request a password reset, please ignore this email. Your account is secure.</p>
      <br>
      <p style="color: #666; font-size: 16px;">Best regards,</p>
      <p style="color: #3b5998; font-size: 18px;">The Team at Paper Company</p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};


// const sendResetPasswordEmail = async (
//   email: string,
//   username: string,
//   link: string,
// ) => {
//   const transporter = createTransporter();

//   const mailOptions = {
//     from: process.env.user,
//     to: email,
//     subject: `Password Reset Request`,
//     html: `
//     <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
//       <h2 style="color: #3b5998; font-size: 24px;">Hello ${username},</h2>
//       <p style="color: #444; font-size: 16px;">We have received a request to reset your password. Please click on the button below to reset your password:</p>
//       <a href="${link}" style="display: inline-block; background-color: #3b5998; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 18px; margin-bottom: 20px;">Reset Password</a>
//       <p style="color: #777; font-size: 14px;">If you did not request a password reset, please ignore this email. Your account is secure.</p>
//       <br>
//       <p style="color: #666; font-size: 16px;">Best regards,</p>
//       <p style="color: #3b5998; font-size: 18px;">The Team at Paper Company</p>
//     </div>
//   `,
//   };

//   await transporter.sendMail(mailOptions);
// };

const sendRegisterEmail = async (
  email: string,
  username: string,
  link: string,
) => {


  const transporter = createTransporter();

  const mailRegisOptions = {
    from: process.env.user,
    to: email,
    subject: `Welcome to Our Service!`,
    html: `
    <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
      <h2 style="color: #3b5998; font-size: 24px;">Hello ${username},</h2>
      <p style="color: #444; font-size: 16px;">Welcome to our service! We're excited to have you on board.</p>
      <p style="color: #444; font-size: 16px;">Please click on the button below to complete your registration:</p>
      <a href="${link}" style="display: inline-block; background-color: #3b5998; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 18px; margin-bottom: 20px;">Complete Registration</a>
      <p style="color: #777; font-size: 14px;">If you did not sign up for our services, please ignore this email.</p>
      <br>
      <p style="color: #666; font-size: 16px;">Best regards,</p>
      <p style="color: #3b5998; font-size: 18px;">The Team at Paper Company</p>
    </div>
  `,
  };

  await transporter.sendMail(mailRegisOptions);
};

const sendEmployeeEmail = async (
  email: string,
  subject: string,
  message: string,
) => {
  const transporter = createTransporter();

  const mailContactOptions = {
    from: process.env.user,
    to: email,
    subject: `${subject}`,
    html: `
    <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
      <img src="https://utfs.io/f/d81505ca-174f-4620-8f0d-bc32358ec28b-1zbfv.png" alt="Logo" style="display: block; margin: 0 auto; width: 200px; height: auto; border-radius: 10px;">  
        <p style="color: #444; font-size: 16px;"><strong>Subject:</strong> ${subject}</p>
        <p style="color: #444; font-size: 16px;"><strong>Message:</strong></p>
        <p style="color: #444; font-size: 16px;">${message}</p>
        <br>
        <p style="color: #666; font-size: 16px;">Best regards,</p>
        <p style="color: #3b5998; font-size: 18px;">The Team at Paper Company</p>
    </div>
  `,
  };

  await transporter.sendMail(mailContactOptions);
};

export { sendResetPasswordEmail, sendRegisterEmail, sendEmployeeEmail };