import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const { userId } = params;
    try {
        const user = await db.user.findUnique({
            where: { userId: userId }
        });
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}