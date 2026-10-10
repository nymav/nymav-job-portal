import { db } from "@/lib/db";
import { resumeCreate } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", {status:401});
    const parsed = resumeCreate.safeParse(await req.json());
    if (!parsed.success) return new NextResponse("Invalid resume details", {status:400});
    if (parsed.data.userProfileId !== userId) return new NextResponse("Forbidden", {status:403});
    await db.userProfile.upsert({where:{userId},create:{userId},update:{}});
    const resume = await db.resumes.create({data:{...parsed.data,userProfileId:userId}});
    return NextResponse.json(resume, {status:201});
  } catch {
    return new NextResponse("Unable to save resume", {status:500});
  }
}
