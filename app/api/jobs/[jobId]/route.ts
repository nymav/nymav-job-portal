import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH handler
export const PATCH = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    const jobId = req.nextUrl.pathname.split("/").pop(); // or use a regex

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Id is missing", { status: 400 });
    }

    const updatedValues = await req.json();

    const job = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error(`[JOB_PATCH]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE handler
export const DELETE = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    const jobId = req.nextUrl.pathname.split("/").pop();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Id is missing", { status: 400 });
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

    await db.job.delete({
      where: {
        id: jobId,
        userId,
      },
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(`[JOB_DELETE]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
