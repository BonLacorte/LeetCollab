import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const GET = async (req: Request, { params }: { params: { userId: string } }) => {
    const { userId } = params;
    console.log("userId:", userId)
    try {
        const solvedProblems = await db.solvedProblems.findMany({
            where: {
                userId: userId,
            },
            include: {
                problem: true,
            },
        });
        return NextResponse.json(solvedProblems);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch solved problems" }, { status: 500 });
    }
}