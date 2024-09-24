

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client'; // Importing Socket.IO client
import { useSession } from 'next-auth/react';

const CardJoinRoom = ({socket}: {socket: Socket | null}) => {

    const { data: session } = useSession(); // Get the session data
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.name) {
            setUsername(session.user.name);
        }
    }, [session]);

    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();
    // const [socket, setSocket] = useState<Socket | null>(null);  

    // useEffect(() => {

    //     // Set the username when the session is available
    //     // if (session?.user?.name) {
    //     //     setUsername(session.user.name);
    //     // }

    //     // const newSocket = io('http://localhost:8000'); // Connect to the backend
    //     // setSocket(newSocket);


    //     // return () => {
    //     //     if (socket) {
    //     //         socket.emit('leaveRoom')
    //     //         newSocket.close();
    //     //     }
    //     // };
    // }, []);

    

    console.log("username: ", username);

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
                                console.log("User joining room: ", username);
                                console.log("Joined room: ", roomId);   
                                // push to the workspace page where the room is
                                router.push(`/Workspace/room/${roomId}/problem/${problemId}`);
                            } else {
                                console.error(response.message);
                                setError(response.message || 'Unknown error');
                            }
                        });
                    } else {
                        console.error(response.message);
                        setError(response.message || 'Unknown error');
                    }
                });
            }
        }


    };

    return (
        <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Join a Room</h2>
            <form onSubmit={handleJoinRoom}>
                <div>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter Room ID"
                        className=" p-2 mb-4 border rounded"
                    />
                    <button
                        type="submit"
                        className=" bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90"
                    >
                        Join Room
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CardJoinRoom;