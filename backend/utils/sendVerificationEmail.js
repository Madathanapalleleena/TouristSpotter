const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, name, verificationUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your gmail
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: `"TripGenie" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - TripGenie",
    html: `
      <p>Hello ${name},</p>
      <p>Thanks for registering with TripGenie! Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>If you did not create this account, you can safely ignore this email.</p>
    `,
  });
};

module.exports = sendVerificationEmail;
