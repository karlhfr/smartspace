import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

export const sendReviewRequestEmail = functions.https.onCall(
    async (data) => {
      const {to, subject, customerName, companyName, reviewUrl} = data;

      const mailOptions = {
        from: `"${companyName}" <${functions.config().gmail.email}>`,
        to,
        subject,
        html: `
        <h1>Dear ${customerName},</h1>
        <p>Thank you for choosing ${companyName} for your recent
        installation. We hope you're enjoying your new Smart Space
        Stair Storage solution.</p>
        <p>We would greatly appreciate if you could take a moment to
        leave a review of your experience. Your feedback helps us
        improve our service and assists other customers in making
        informed decisions.</p>
        <p>Please click the following link to submit your review:</p>
        <a href="${reviewUrl}">${reviewUrl}</a>
        <p>Thank you for your time and feedback!</p>
        <p>Best regards,<br>${companyName}</p>
      `,
      };

      try {
        await transporter.sendMail(mailOptions);
        return {success: true, message: "Email sent successfully"};
      } catch (error) {
        console.error("Error sending email:", error);
        throw new functions.https.HttpsError("internal", "Error sending email");
      }
    },
);
