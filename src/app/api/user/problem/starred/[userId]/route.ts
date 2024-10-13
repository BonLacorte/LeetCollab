import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const GET = async (req: Request, { params }: { params: { userId: string } }) => {
    const { userId } = params;
    try {
        const starredProblems = await db.starredProblems.findMany({
            where: { userId: userId },
            include: {
                problem: true,
            },
        });
        return NextResponse.json(starredProblems);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch starred problems" }, { status: 500 });
    }
}