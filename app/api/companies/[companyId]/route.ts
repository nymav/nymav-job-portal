import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Corrected parameter structure for route handlers in Next.js 15
export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const { userId } = await auth();
    const { companyId } = params;

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
