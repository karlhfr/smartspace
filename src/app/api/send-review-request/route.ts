import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { to, subject, customerName, companyName, fitterName, reviewUrl } = await request.json();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${companyName}" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: `
      <h1>Dear ${customerName},</h1>
      <p>Thank you for choosing ${companyName} for your recent installation. 
      We hope you're enjoying your new Smart Space Stair Storage solution.</p>
      <p>Your installation was completed by ${fitterName}. We would greatly appreciate if you could take a moment to leave a 
      review of your experience. Your feedback helps us improve our service 
      and assists other customers in making informed decisions.</p>
      <p>Please click the following link to submit your review:</p>
      <a href="${reviewUrl}">${reviewUrl}</a>
      <p>Thank you for your time and feedback!</p>
      <p>Best regards,<br>${companyName}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Error sending email" },
      { status: 500 }
    );
  }
}