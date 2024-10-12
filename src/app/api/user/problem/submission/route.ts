import { db } from '@/lib/db'; // Adjust this import based on your Prisma setup
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest, res: NextResponse) => {
    
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { userId, problemId, status } = await req.json();

    console.log("submission route - userId: ", userId);
    console.log("submission route - problemId: ", problemId);
    console.log("submission route - status: ", status);

    if (!userId || !problemId || !status) {
        return NextResponse.json({ message: 'Missing userId or problemId' }, { status: 400 });
    }

    try {
        // console.log("userId 1: ", userId);
        // console.log("problemId 1: ", problemId);

        // Create a new record
        await db.submission.create({
        data: {
            userId,
            problemId: problemId,
            status: status,
        },
        });

        return NextResponse.json({ message: 'Problem marked as solved' }, { status: 201 });
    } catch (error) {
        console.error('Error updating solved problem:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}