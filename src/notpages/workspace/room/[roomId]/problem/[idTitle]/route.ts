import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type ProblemParams = {
    idTitle: string;
}

export const GET = async (req: Request, { params }: { params: ProblemParams }) => {
    console.log(params.idTitle);
    try {
        console.log("Fetching problem: ", params.idTitle);
        const problem = await db.problem.findUnique({
            where: {
                idTitle: params.idTitle,
            }
        });
        return NextResponse.json({ problem });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch problem" }, { status: 500 });
    }
}