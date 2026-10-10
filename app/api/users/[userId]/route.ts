import { db } from "@/lib/db";
import { profilePatch } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if ((await params).userId !== userId) return new NextResponse("Forbidden", { status: 403 });
    const parsed = profilePatch.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({error:"Invalid profile update"}, {status:400});
    const values = parsed.data;
    if (values.activeResumeId) {
      const resume = await db.resumes.findFirst({where:{id:values.activeResumeId,userProfileId:userId}});
      if (!resume) return new NextResponse("Resume not found", {status:404});
    }
    const profile = await db.userProfile.upsert({ where:{userId}, update:values, create:{...values,userId} });
    return NextResponse.json(profile);
  } catch {
    return new NextResponse("Unable to update profile", {status:500});
  }
}
