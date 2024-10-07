import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type ProblemUserParams = {
    idTitle: string;
    userId: string;
}

// Know if the user has liked, starred, or solved the problem
export const GET = async (req: Request, { params }: { params: ProblemUserParams }) => {
    const { idTitle, userId } = params;
    try {
        // Get the problem id from the idTitle
        const problem = await db.problem.findUnique({
            where: {
                idTitle: idTitle,
            }
        });
        // Check if the user has liked the problem and return true. If not, return false.
        const liked = await db.likedProblems.findFirst({
            where: {
                problemId: problem?.problemId,
                userId: userId,
            }
        });
        const starred = await db.starredProblems.findFirst({
            where: {
                problemId: problem?.problemId,
                userId: userId,
            }
        });
        const solved = await db.solvedProblems.findFirst({
            where: {
                problemId: problem?.problemId,
                userId: userId,
            }
        });
        const data = {
            liked: liked ? true : false,
            starred: starred ? true : false,
            solved: solved ? true : false,
        }
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch problem" }, { status: 500 });
    }
}

