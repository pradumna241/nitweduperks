const nodemailer = require('nodemailer');
require('dotenv').config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = Number(process.env.EMAIL_PORT || 465);
const emailSecure = process.env.EMAIL_SECURE !== 'false';


  console.log(emailUser, emailPass, emailHost, emailPort, emailSecure);
const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

/**
 * Send email using Nodemailer SMTP transport.
 * Requires EMAIL_USER and EMAIL_PASS (or EMAIL_APP_PASSWORD) in the .env file.
 */
const sendGridSend = async ({ to, subject, text, html }) => {
  const from = process.env.EMAIL_FROM || emailUser || 'pradumnaverma2001@gmail.com';

  if (!emailUser || !emailPass) {
    console.log('Email SMTP not configured — email content:');
    console.log({ to, subject, text, html });
    return;
  }

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
};

module.exports = { sendGridSend };