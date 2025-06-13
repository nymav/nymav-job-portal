import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { name, url, userProfileId } = await req.json();

    const resume = await db.resumes.create({
      data: {
        name,
        url,
        userProfileId,
      },
    });

    return NextResponse.json(resume);
  } catch (error) {
    console.error("RESUME_POST_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};