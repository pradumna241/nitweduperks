// const axios = require('axios');

// /**
//  * Send email using SendGrid HTTP API.
//  * Requires SENDGRID_API_KEY and EMAIL_FROM env vars.
//  * Falls back to console.log when not configured.
//  */
// const sendGridSend = async ({ to, subject, text, html }) => {
//   const apiKey = process.env.SENDGRID_API_KEY;
//   const from = process.env.EMAIL_FROM || 'no-reply@example.com';

//   if (!apiKey) {
//     console.log('SendGrid API key not configured — email content:');
//     console.log({ to, subject, text, html });
//     return;
//   }

//   const payload = {
//     personalizations: [{ to: [{ email: to }] }],
//     from: { email: from },
//     subject,
//     content: []
//   };

//   if (html) payload.content.push({ type: 'text/html', value: html });
//   if (text) payload.content.push({ type: 'text/plain', value: text });

//   await axios.post('https://api.sendgrid.com/v3/mail/send', payload, {
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       'Content-Type': 'application/json'
//     }
//   });
// };

// module.exports = { sendGridSend };


const { Resend } = require('resend');

/**
 * Send email using Resend HTTP API.
 * Requires RESEND_API_KEY in the .env file.
 */
const sendGridSend = async ({ to, subject, text, html }) => {
  const apiKey = process.env.RESEND_API_KEY;

  // Check whether API key exists
  if (!apiKey) {
    console.log('Resend API key not configured — email content:');
    console.log({ to, subject, text, html });
    return;
  }

  // Create Resend client
  const resend = new Resend(apiKey);

  // Send email
  const { data, error } = await resend.emails.send({
    from: 'Student Reward <onboarding@resend.dev>',
    to: [to],
    subject: subject,
    text: text,
    html: html
  });

  // Handle Resend error
  if (error) {
    console.error('Resend email error:', error);
    throw new Error(error.message);
  }

  console.log('Email sent successfully:', data);

  return data;
};

module.exports = { sendGridSend };