import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {

        const {userId} =  await auth();

        const{name} = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(typeof name !== "string" || !name.trim() || name.length > 200){
            return new NextResponse("name is required", { status: 400 });
        }

        const company = await db.company.create({
            data: {
                userId,
                name: name.trim(),
                followers: [],
            }
        })

        return NextResponse.json(company);

    } catch (_error){
        console.error('[COMPANY_POST]');
        return new NextResponse("Internal Server Error", { status: 500 });

    }
};
