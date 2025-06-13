import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { userId: currentUserId } = await auth();

    // Extract the userId from the URL
    const segments = req.nextUrl.pathname.split("/");
    const userId = segments[segments.indexOf("users") + 1]; // Gets [userId] from /users/[userId]/appliedJobs

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

    // Update user contact email
    await db.userProfile.update({
      where: { userId },
      data: {
        email: contactEmail,
      },
    });

    // Return updated profile with resumes and applied jobs
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
