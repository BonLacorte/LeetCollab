import React, { useState, useEffect } from 'react';
import { useSocket } from '@/components/SocketProvider';
import { Mic, MicOff, User } from 'lucide-react';
import { useGetUsername } from '@/hooks/useGetUsername';

type MembersProps = {
    roomId: string;
};

const Members: React.FC<MembersProps> = ({ roomId }) => {
    const [members, setMembers] = useState<string[]>([]);
    const socket = useSocket();
    const currentUsername = useGetUsername();
    const [isHost, setIsHost] = useState(false);

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

            // Check if current user is host
            socket.emit('getHost', { roomId }, (response: any) => {
                if (response.success) {
                    setIsHost(response.host === currentUsername);
                }
            });
        }

        return () => {
        if (socket) {
            socket.off('updateMembers');
        }
        };
    }, [socket, roomId]);

    const handleMicToggle = (username: string) => {
        if (socket) {
            socket.emit('toggleMic', { roomId, username });
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-4">
        {/* <h2 className="text-lg font-semibold mb-4">Room Members</h2> */}
        <ul className="space-y-2">
            {members.map((member, index) => (
            <li key={index} className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
                <User size={20} className="text-gray-500" />
                <span>{member}</span>
            </div>
            
                {/* // <button 
                //     onClick={() => handleMicToggle(member)}
                //     className="focus:outline-none"
                // >
                //     {member.isMuted ? (
                //         <MicOff size={20} className="text-gray-500" />
                //     ) : (
                //         <Mic size={20} className="text-gray-500" />
                //     )}
                // </button> */}
                <button 
                    onClick={() => handleMicToggle(member)}
                    className="focus:outline-none"
                >
                    <MicOff size={20} className="text-gray-500" />
                </button>
            
            </li>
            ))}
        </ul>
        </div>
    );
};

export default Members;