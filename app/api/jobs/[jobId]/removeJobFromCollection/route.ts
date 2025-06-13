import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    // Extract jobId from the pathname: /api/jobs/[jobId]/removeJobFromCollection
    const jobId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!userId || !jobId) {
      return new NextResponse("Unauthorized or Missing Job ID", { status: 401 });
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job || !job.savedUsers?.includes(userId)) {
      return new NextResponse("Job not found or user not in savedUsers", { status: 404 });
    }

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        savedUsers: {
          set: job.savedUsers.filter((id) => id !== userId),
        },
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("[REMOVE_JOB_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
