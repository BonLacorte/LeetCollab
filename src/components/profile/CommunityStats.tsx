import React from 'react';
import { Eye, MessageSquare, Star } from 'lucide-react';
import { TiStarOutline } from 'react-icons/ti'
import { AiFillLike } from 'react-icons/ai'

const CommunityStats = () => {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Community Stats</h2>
            <div className="space-y-2">
                <div className="flex items-center">
                    <AiFillLike className="w-4 h-4 mr-2" />
                    <span>Liked 0</span>
                </div>
                <div className="flex items-center">
                    <TiStarOutline className="w-4 h-4 mr-2" />
                    <span>Starred 0</span>
                </div>
                {/* <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span>Discuss 0</span>
                </div>
                <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    <span>Reputation 0</span>
                </div> */}
            </div>
        </div>
    );
};

export default CommunityStats;