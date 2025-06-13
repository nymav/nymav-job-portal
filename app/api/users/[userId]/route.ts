import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const values = await req.json();

    const existingProfile = await db.userProfile.findUnique({
      where: { userId },
    });

    let userProfile;

    if (existingProfile) {
      userProfile = await db.userProfile.update({
        where: { userId },
        data: values,
      });
    } else {
      userProfile = await db.userProfile.create({
        data: {
          userId,
          ...values,
        },
      });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("[PROFILE_PATCH_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};