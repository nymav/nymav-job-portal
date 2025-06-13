import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Correct structure for route handlers
export const PATCH = async (
  req: Request,
  context: { params: { companyId: string } }
) => {
  try {
    const { userId } = await auth();
    const { companyId } = context.params;
    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    const company = await db.company.update({
      where: {
        id: companyId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error(`[company_PATCH]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};