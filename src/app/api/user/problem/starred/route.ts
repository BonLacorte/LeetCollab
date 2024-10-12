import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { userId, problemId } = await req.json();

    if (!userId || !problemId) {
        return NextResponse.json({ message: 'Missing userId or problemId' }, { status: 400 });
    }

    try {
        const existingStar = await db.starredProblems.findFirst({
            where: {
                userId: userId,
                problemId: problemId,
            },
        });

        if (existingStar) {
            // Unstar: Remove the existing star
            await db.starredProblems.delete({
                where: {
                    starredProblemId: existingStar.starredProblemId,
                },
            });
            return NextResponse.json({ message: "Problem unstarred successfully" }, { status: 200 });
        } else {
            // Star: Create a new star
            await db.starredProblems.create({
                data: {
                    userId: userId,
                    problemId: problemId,
                },
            });
            return NextResponse.json({ message: "Problem starred successfully" }, { status: 200 });
        }
    } catch (error) {
        console.error("Error starring problem:", error);
        return NextResponse.json({ error: "Failed to star problem" }, { status: 500 });
    }
}