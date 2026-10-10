import { sendMail } from "@/lib/mail";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const {userId} = await auth();
    if (!userId) return new NextResponse("Unauthorized", {status:401});
    const profile = await db.userProfile.findUnique({where:{userId}});
    if (!profile?.email) return new NextResponse("Complete your profile first", {status:400});
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) return NextResponse.json({sent:false,reason:"Email is not configured"});
    const user = await currentUser();
    const verifiedEmail = user?.emailAddresses.find(email => email.id === user.primaryEmailAddressId && email.verification?.status === "verified");
    if (!verifiedEmail) return new NextResponse("Verify your account email first", {status:400});
    await sendMail({to:verifiedEmail.emailAddress,name:profile.fullName || "there",subject:"Application received",body:"Your application has been recorded in Job Portal."});
    return NextResponse.json({sent:true});
  } catch {
    return new NextResponse("Unable to send confirmation", {status:500});
  }
}
