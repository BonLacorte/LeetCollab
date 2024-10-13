import { useGetUsername } from '@/hooks/useGetUsername';
import { User } from '@/types/problems';
import { useSession } from 'next-auth/react';
import React from 'react'

type Props = {
    topUsers: User[];
    userRank: number;
    userAcceptanceRate: number;
}

const TopUsers = ({ topUsers, userRank, userAcceptanceRate }: Props) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const username = useGetUsername();
    
    const displayUsers = topUsers.slice(0, 10);
    const currentUser = topUsers.find(user => user.userId === userId);
    const isUserInTop10 = displayUsers.some(user => user.userId === userId);

    console.log("isUserInTop10: ", isUserInTop10);

    if (!isUserInTop10 && currentUser) {
        console.log("currentUser is added to displayUsers");
        displayUsers.push(currentUser);
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Top 10</h2>
            <ol className="list-decimal list-inside text-sm">
                {displayUsers.map((user, index) => (
                    <li key={user.userId} className={`mb-2 ${user.userId === userId ? 'font-bold' : ''}`}>
                        <span className="font-semibold">{user.name}</span>
                        <span className="ml-2 text-gray-500">
                            (Acceptance Rate: {user.acceptanceRate.toFixed(2)}%)
                        </span>
                    </li>
                ))}
                {!isUserInTop10 && (
                    <div className='flex flex-col'>
                        <span>...</span>
                        <span className=" text-sm font-bold text-gray-900">
                            {/* (Your Rank: {userRank}) */}
                            <span className=''>{userRank}. </span>
                            <span className="">{username}</span>
                            <span className="ml-2 text-xs">
                                (Acceptance Rate: {userAcceptanceRate.toFixed(2)}%)
                            </span>
                        </span>
                    </div>
                )}
            </ol>
        </div>
    )
}

export default TopUsers