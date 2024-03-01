import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.service!,
    auth: {
      user: process.env.user!,
      pass: process.env.pass!,
    },
  });
};


const sendResetPasswordEmail = async (email:string, username:string, link:string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.user,
    to: email,
    subject: `Password Reset`,
    text: `
      Hello ${username},

      We have received a request to reset your password. Please click on the link below to reset your password:

      ${link}

      If you did not request a password reset, please ignore this email. Your account is secure.

      Best regards,
      The Team at [Your Company Name]
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendRegisterEmail = async (email:string, username:string, link:string) => {
  const transporter = createTransporter();

  const mailRegisOptions = {
    from: process.env.user,
    to: email,
    subject: `Welcome!`,
    text: `
      Hello ${username},

      Welcome in our service!
      Please click on the link below to end your registration:

      ${link}

      If you did not sign up in our services, please ignore this email.

      Best regards,
      The Team at [Your Company Name]
    `,
  };

  await transporter.sendMail(mailRegisOptions);
};

const sendContactEmail = async (name:string, email:string, subject:string, message:string) => {
  const transporter = createTransporter();

  const mailContactOptions = {
    from: email,
    to: process.env.user,
    subject: `Message from ${email}: ${subject}`,
    text: 
  `
  Email sender: ${email}
  Name of sender: ${name}
  Subject: ${subject}\n
  Message:\n\n ${message}.
  `,
  };

  await transporter.sendMail(mailContactOptions);
};

export { sendResetPasswordEmail, sendRegisterEmail, sendContactEmail};
