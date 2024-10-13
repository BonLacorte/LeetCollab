

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client'; // Importing Socket.IO client
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, useToast } from '@/hooks/use-toast';

const CardJoinRoom = ({socket, username}: {socket: Socket | null, username: string | null}) => {
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    // console.log("username: ", username);

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.trim()) {
            console.log("Joining room: ", roomId, "username: ", username);

            if (socket) {
                socket.emit('checkRoom', { roomId }, (response: { success: boolean, message?: string }) => {
                    if (response.success) {
                        socket.emit('joinRoom', {roomId, username}, (joinResponse: { success: boolean, selectedProblem: string }) => {
                            if (joinResponse.success) {

                                // get the problemId from the selectedProblem
                                const problemId = joinResponse.selectedProblem;
                                console.log("problemId: ", problemId);
                                console.log("User joining room: ", username);
                                console.log("Joined room: ", roomId);   

                                // store room information in local storage
                                localStorage.setItem('roomInfo', JSON.stringify({ roomId, username }));

                                // push to the workspace page where the room is
                                router.push(`/workspace/room/${roomId}/problem/${problemId}`);
                            } else {
                                console.error(response.message);
                                setError(response.message || 'Unknown error');
                            }
                        });
                    } else {
                        console.error(response.message);
                        setError(response.message || 'Unknown error');
                        // toast error
                        toast({
                            className: "bg-white text-gray-900 border border-gray-200 shadow-xl rounded-xl",
                            title: "Error",
                            description: response.message,
                        });
                    }
                });
            }
        }


    };

    return (
        <div className="text-center mb-12">
            {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">Collaborate and solve coding challenges together</h2>
            <p className="text-xl text-gray-600 mb-8">Join a room or create your own to start coding with friends</p> */}
            <form className="flex justify-center space-x-4" onSubmit={handleJoinRoom}>
                {/* <div> */}
                {/* <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                    className=" p-2 mb-4 border rounded"
                /> */}
                <Input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                    className="w-64 py-6 px-4 rounded-lg border-gray-400 outline-gray-400 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 "
                    required
                />
                <Button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                >
                    Join Room
                </Button>

                {/* </div> */}
            </form>
        </div>
    );
};

export default CardJoinRoom;