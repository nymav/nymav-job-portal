import { sendMail } from "@/lib/mail";
import { NextResponse } from "next/server"; // adjust path if needed

export const POST = async (req: Request) => {
    try {
      const { email, fullName } = await req.json();
  
      if (!email || !fullName) {
        return new NextResponse("Missing email or full name", { status: 400 });
      }
  
      await sendMail({
        to: email,
        name: fullName,
        subject: "Welcome to Our Platform!",
        body: `Hi ${fullName},\n\nThank you for registering. We're excited to have you onboard!`,
      });
  
      return NextResponse.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("SEND_MAIL_ERROR:", error);
      return new NextResponse("Failed to send email", { status: 500 });
    }
  };