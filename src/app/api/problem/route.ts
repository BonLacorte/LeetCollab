import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all problems
export const GET = async (req: Request) => {
    try {
        const problems = await db.problem.findMany({
            orderBy: {
                order: 'asc',
            },
        });
        return NextResponse.json( problems );
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 });
    }
}      