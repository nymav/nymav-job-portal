import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req: NextRequest, context: { params: { companyId: string } }) {
  try {
    const { userId } = await auth();
    const { companyId } = context.params;

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
