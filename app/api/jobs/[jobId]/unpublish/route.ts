import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    const jobId = req.nextUrl.pathname.split("/").at(-2); // assumes route: /jobs/[jobId]/unpublish

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

    const unpublishedJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedJob);
  } catch (error) {
    console.log(`[JOB_UNPUBLISH_PATCH] : ${error}`);
    return new NextResponse("Internal error", { status: 500 });
  }
};
