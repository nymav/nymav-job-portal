import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, {params}:{params :{companyId: string}}) => {
    try {

        const {userId} =  await auth();
        const {companyId} =  params;
        
        const updatedValues = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!companyId){
            return new NextResponse("Id is missing", { status: 401 });
        }


        const company = await db.company.update({
            where:{
                id: companyId,
                userId,
            }, data:{
                ...updatedValues,
            }
        })

        return NextResponse.json(company);

    } catch (error){ 
        console.log(`[company_PATCH] : ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });

    }
};