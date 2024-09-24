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
        return NextResponse.json({ problems });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 });
    }
}


// // POST a new problem
// export const POST = async (req: Request) => {
//     const { title, description, difficulty, category } = req.body;
//     const problem = await db.problem.create({
//         data: {
//             title,
//             description,
//             difficulty,
//             category
//         }
//     });
//     return NextResponse.json({ problem });
// }
        
