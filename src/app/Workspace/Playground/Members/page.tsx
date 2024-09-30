import React, { useState, useEffect } from 'react';
import { useSocket } from '@/components/SocketProvider';
import { User } from 'lucide-react';

type MembersProps = {
    roomId: string;
};

const Members: React.FC<MembersProps> = ({ roomId }) => {
    const [members, setMembers] = useState<string[]>([]);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
        // Get initial members list
        socket.emit('getRoomMembers', { roomId }, (roomMembers: string[]) => {
            setMembers(roomMembers);
        });

        // Listen for updates to the members list
        socket.on('updateMembers', (updatedMembers: string[]) => {
            setMembers(updatedMembers);
        });
        }

        return () => {
        if (socket) {
            socket.off('updateMembers');
        }
        };
    }, [socket, roomId]);

    return (
        <div className="bg-white shadow-sm rounded-lg p-4">
        {/* <h2 className="text-lg font-semibold mb-4">Room Members</h2> */}
        <ul className="space-y-2">
            {members.map((member, index) => (
            <li key={index} className="flex items-center space-x-2">
                <User size={20} className="text-gray-500" />
                <span>{member}</span>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default Members;