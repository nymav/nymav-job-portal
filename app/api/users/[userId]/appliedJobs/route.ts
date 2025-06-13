// app/api/users/[userId]/appliedJobs/route.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { userId: string } }) => {
  try {
    const { userId: currentUserId } = await auth();
    const { userId } = params;

    if (!currentUserId || currentUserId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { jobId, resumeId, contactEmail } = body;

    if (!jobId || !resumeId || !contactEmail) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if already applied
    const alreadyApplied = await db.appliedJob.findFirst({
      where: {
        userId,
        jobId,
      },
    });

    if (!alreadyApplied) {
      await db.appliedJob.create({
        data: {
          userId,
          jobId,
          appliedAt: new Date(),
        },
      });
    }

    // Update profile contact if changed
    await db.userProfile.update({
      where: { userId },
      data: {
        email: contactEmail,
      },
    });

    // Return updated profile WITH resumes and appliedJobs
    const updatedProfile = await db.userProfile.findUnique({
      where: { userId },
      include: {
        resumes: true,
        appliedJobs: {
          select: {
            jobId: true,
            appliedAt: true,
          },
        },
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("APPLY_JOB_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};