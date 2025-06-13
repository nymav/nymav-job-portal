import nodemailer from "nodemailer";
import handlebars from "handlebars";

export const sendMail = async ({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    throw new Error("SMTP credentials are not set in environment variables");
  }

  // 1. Setup transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  // 2. Create HTML template using handlebars
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello {{name}},</h2>
      <p>{{body}}</p>
      <br />
      <p>Best regards,</p>
      <p>Your Company</p>
    </div>
  `;

  const template = handlebars.compile(htmlTemplate);
  const htmlContent = template({ name, body });

  // 3. Send email
  const mailOptions = {
    from: `"Your App Name" <${SMTP_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent:", info);
  } catch (err) {
    console.error("MAIL_SEND_ERROR:", err);
    throw err;
  }
};