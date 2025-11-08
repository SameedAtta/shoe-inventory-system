const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // use 587 with secure: false if needed
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be an App Password (not your Gmail login password)
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Shoe Inventory" <${process.env.EMAIL_USER}>`, // must match EMAIL_USER
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};

module.exports = sendEmail;



// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail", // or use "smtp.yourprovider.com"
//   auth: {
//     user: process.env.EMAIL_USER, // your email address
//     pass: process.env.EMAIL_PASS, // app password
//   },
// });

// const sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     await transporter.sendMail({
//       from: `"Shoe Inventory" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });
//     console.log("✅ Email sent successfully");
//   } catch (err) {
//     console.error("❌ Email sending failed:", err.message);
//   }
// };

// module.exports = sendEmail;