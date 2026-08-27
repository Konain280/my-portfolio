import nodemailer from "nodemailer";

export function isEmailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD && process.env.DISABLE_EMAIL !== "true");
}

export async function sendContactNotification({ id, name, email, message }) {
  if (!isEmailConfigured()) return false;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
  });
  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `You received a new portfolio message.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    return true;
  } catch {
    console.error(`Email notification failed for contact ID ${id}.`);
    return false;
  }
}
