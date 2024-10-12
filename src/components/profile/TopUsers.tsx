import { User } from '@/types/problems';
import React from 'react'

type Props = {
    topUsers: User[];
}

const TopUsers = ({ topUsers }: Props) => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Top 10</h2>
            <ol className="list-decimal list-inside">
                {topUsers.slice(0, 10).map((user, index) => (
                    <li key={user.userId} className="mb-2">
                        <span className="font-semibold">{user.name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                            (Acceptance Rate: {user.acceptanceRate})
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default TopUsers