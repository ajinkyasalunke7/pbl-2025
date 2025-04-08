import nodemailer from "nodemailer";
import { config } from "../config/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "your-email@gmail.com", pass: "your-app-password" },
});

export const sendInvitationEmail = async (
  to,
  token,
  teamName,
  hackathonTitle
) => {
  const inviteUrl = `http://localhost:3000/user/invitation/accept/${token}`; // Create the URL here.

  const mailOptions = {
    from: "your-email@gmail.com",
    to,
    subject: `Invitation to Join ${teamName} for ${hackathonTitle}`,
    html: `<p>You've been invited to join ${teamName} for ${hackathonTitle}.</p>
           <p>Click <a href="${inviteUrl}">here</a> to accept.</p>
           <p>If you don't have an account, register with this email first.</p>
           <p>This invitation expires in 48 hours.</p>`,
  };

  console.log(
    `Invitation to ${to}: Join ${teamName} for ${hackathonTitle} at ${config.BACKEND_URL}/api/user/invitation/accept/${token}`
  );
  // await transporter.sendMail(mailOptions);
};
