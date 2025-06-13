import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    const jobId = req.nextUrl.pathname.split("/").slice(-2, -1)[0]; // extracts jobId from /jobs/[jobId]/publish

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID is missing", { status: 404 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const publishJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishJob);
  } catch (error) {
    console.log(`[JOB_PUBLISH_PATCH]:`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
