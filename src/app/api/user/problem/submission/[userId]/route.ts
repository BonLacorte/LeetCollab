import { db } from '@/lib/db'; // Adjust this import based on your Prisma setup
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const { userId } = params;

    try {
        const submissions = await db.submission.findMany({
            where: { userId },
            include: {
                problem: true,
            },
        });
        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}