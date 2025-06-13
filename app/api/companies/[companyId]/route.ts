import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    const url = req.nextUrl;
    const companyId = url.pathname.split("/").pop(); // or use regex

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 });
    }

    const updatedValues = await req.json();

    const company = await db.company.update({
      where: {
        id: companyId,
        userId,
      },
      data: updatedValues,
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("[COMPANY_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
