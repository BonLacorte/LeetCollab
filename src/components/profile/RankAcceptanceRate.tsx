import React from 'react'

type Props = {
    userRank: number;
    userAcceptanceRate: number;
}

const RankAcceptanceRate = ({ userRank, userAcceptanceRate }: Props) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Rank:</span>
                <span className="font-semibold">{userRank}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Acceptance Rate:</span>
                <span className="font-semibold">{userAcceptanceRate.toFixed(2)}%</span>
            </div>
        </div>
    )
}

export default RankAcceptanceRate