import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    const jobId = req.nextUrl.pathname.split("/").at(-2); // Extract jobId from URL path

    if (!userId || !jobId) {
      return new NextResponse("Unauthorized or Missing Job ID", { status: 401 });
    }

    const job = await db.job.update({
      where: { id: jobId },
      data: {
        savedUsers: {
          push: userId,
        },
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("[SAVE_JOB_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};