// pages/workspace/room/[roomId]/problem/[problemId]/page.tsx
'use client';
import ProblemDescription from '@/app/Workspace/ProblemDescription/page';
import Playground from '@/app/Workspace/Playground/page';
import Split from 'react-split';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react'; // Assuming you're using NextAuth

interface WorkspaceProps {
    params: {
        roomId: string;
        problemId: string;
    };
}

const Workspace =  ({ params }: WorkspaceProps) => {
    const { roomId, problemId } = params; // Grab roomId and problemId from the dynamic route
    const router = useRouter();
    const socket = io('http://localhost:8000'); // Adjust the server URL if needed
    const { data: session } = useSession(); // Get the session data
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Set the username when the session is available
        if (session?.user?.name) {
            setUsername(session.user.name);
        }
        // Connect to the room when the page loads
        // if (roomId) {
        //     console.log('Joining room: ', roomId);
        //     socket.emit('joinRoom', { roomId, username });
        // }


        // return () => {
        //     // Cleanup and leave the room when the user leaves the page
        //     handleLeaveRoom();
        // };
    }, [roomId, session]);

    const handleLeaveRoom = () => {
        if (socket && roomId) {
            console.log('Hello');
            console.log('Leaving room: ', roomId);
            socket.emit('leaveRoom', { roomId, username }, (response: any) => {
                if (response.success) {
                    router.push('/'); // Redirect to homepage after leaving
                } else {
                    console.error(response.message);
                }
            });
        }
    };

    if (!roomId || !problemId) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-center text-2xl font-bold mb-4">Room ID: {roomId} | Problem ID: {problemId}</h1>

            <button 
                onClick={handleLeaveRoom} 
                className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
                Leave Room
            </button>

            <Split className="split" minSize={0}>
                <ProblemDescription roomId={roomId as string} problemId={problemId as string}/>  {/* Problem description */}
                
                <div className='w-1/2'>
                    <Playground  /> {/* Coding playground */}
                </div>
            </Split>
        </div>
    );
}

export default Workspace;
