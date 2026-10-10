import { db } from "@/lib/db";
import { applicationCreate } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}: {params: Promise<{userId:string}>}) {
  try {
    const {userId} = await auth();
    if (!userId) return new NextResponse("Unauthorized", {status:401});
    if ((await params).userId !== userId) return new NextResponse("Forbidden", {status:403});
    const parsed = applicationCreate.safeParse(await req.json());
    if (!parsed.success) return new NextResponse("Invalid application", {status:400});
    const {jobId,resumeId,contactEmail} = parsed.data;
    const [job,resume] = await Promise.all([
      db.job.findFirst({where:{id:jobId,isPublished:true}}),
      db.resumes.findFirst({where:{id:resumeId,userProfileId:userId}}),
    ]);
    if (!job || !resume) return new NextResponse("Job or resume not found", {status:404});
    await db.$transaction(async (tx) => {
      await tx.userProfile.upsert({where:{userId},create:{userId,email:contactEmail},update:{email:contactEmail}});
      const existing = await tx.appliedJob.findFirst({where:{userId,jobId}});
      if (!existing) await tx.appliedJob.create({data:{userId,jobId,resumeId,resumeName:resume.name,resumeUrl:resume.url,contactEmail}});
    });
    return NextResponse.json(await db.userProfile.findUnique({where:{userId},include:{resumes:true,appliedJobs:true}}));
  } catch {
    return new NextResponse("Unable to submit application", {status:500});
  }
}
