import nodemailer from "nodemailer";

export async function sendMail({to,name,subject,body}:{to:string;name:string;subject:string;body:string}) {
  const {SMTP_EMAIL,SMTP_PASSWORD} = process.env;
  if (!SMTP_EMAIL || !SMTP_PASSWORD) throw new Error("SMTP is not configured");
  const transporter = nodemailer.createTransport({service:"gmail",auth:{user:SMTP_EMAIL,pass:SMTP_PASSWORD}});
  await transporter.sendMail({from:`"Job Portal" <${SMTP_EMAIL}>`,to,subject,text:`Hi ${name},\n\n${body}\n\nJob Portal`});
}
