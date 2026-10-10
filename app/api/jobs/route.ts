import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {

        const {userId} =  await auth();

        const{title} = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(typeof title !== "string" || !title.trim() || title.length > 200){
            return new NextResponse("Title is required", { status: 400 });
        }

        const job = await db.job.create({
            data: {
                userId,
                title: title.trim(),
                tags: [],
                savedUsers: [],
            }
        })

        return NextResponse.json(job);

    } catch (_error){
        console.error('[JOB_POST]');
        return new NextResponse("Internal Server Error", { status: 500 });

    }
};
