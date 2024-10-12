import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {

    const { userId } = params;
    console.log(userId);
    // Get the user's acceptance rate and rank
    let userRank: number = 0;
    let userAcceptanceRate: number = 0;

    // create an array for all users
    let allUsers: any[];

    // each user has the following properties: userId, username, name, email, acceptanceRate, ranking, totalSolvedProblems
    allUsers = await db.user.findMany({
        select: {
            userId: true,
            username: true,
            name: true,
            email: true,
        }
    });


    // get the total number of submissions of each user and the number of accepted submissions of each user to calculate the acceptance rate of each user (acceptanceRate) and place them in each user object
    for (let user of allUsers) {
        const totalSubmissions = await db.submission.count({
            where: {
                userId: user.userId
            }
        });

        const acceptedSubmissions = await db.submission.count({
            where: {
                userId: user.userId,
                status: "Accepted"
            }
        });

        user.acceptanceRate = totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0;
    }

    

    //get number of solved problems of each user and place them in each user object (totalSolvedProblems)
    for (let user of allUsers) {
        const totalSolvedProblems = await db.solvedProblems.count({
            where: {
                userId: user.userId
            }
        });
        user.totalSolvedProblems = totalSolvedProblems;
    }

    // rank the users based on their acceptance rate and the number of solved problems and place them in each user object (ranking)
    
        // create a formula to rank the users based on their acceptance rate and the number of solved problems
        // ranking = (acceptanceRate * 0.7) + (totalSolvedProblems * 0.3)

    allUsers.sort((a, b) => (b.acceptanceRate * 0.7) + (b.totalSolvedProblems * 0.3) - ((a.acceptanceRate * 0.7) + (a.totalSolvedProblems * 0.3)));

    for (let i = 0; i < allUsers.length; i++) {
        allUsers[i].ranking = i + 1;
    }

    console.log(allUsers);

    // get the top 10 users and place them in another array (topUsers)
    const topUsers = allUsers.slice(0, 10);

    // get the user's rank and acceptance rate from the allUsers array and place them in variables (userRank, userAcceptanceRate)
    const user = allUsers.find(user => user.userId === userId);
    if (user) {
        userRank = user.ranking as number;
        userAcceptanceRate = user.acceptanceRate as number;
    }

    console.log(userRank, userAcceptanceRate);

    return NextResponse.json({ allUsers, userRank, userAcceptanceRate, topUsers }, { status: 200 })
}
