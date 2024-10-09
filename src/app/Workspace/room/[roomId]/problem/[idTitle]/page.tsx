// pages/workspace/room/[roomId]/problem/[problemId]/page.tsx
'use client';
import ProblemDescription from '@/app/workspace/ProblemDescription/page';
import Playground from '@/app/workspace/Playground/page';
import Split from 'react-split';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react'; // Assuming you're using NextAuth
import useWindowSize from '@/hooks/useWindowSize';
import { DBProblem, Problem } from "@/types/problems";
import { problems } from '@/lib/problems';
import Topbar from '@/components/topbar/Topbar';
import { useGetUsername } from '@/hooks/useGetUsername';
import { useSocket } from '@/components/SocketProvider';
import Confetti from "react-confetti";
import { useGetProblemByIdTitleQuery } from '@/app/state/api';
import React from 'react';

interface WorkspaceProps {
    params: {
        roomId: string;
        idTitle: string;
    };
}

const Workspace =  ({ params }: WorkspaceProps) => {
    const { roomId, idTitle } = params; // Grab roomId and problemId from the dynamic route
    const router = useRouter();
    const [problem, setProblem] = useState<Problem | null>(null);
    // const [dbProblem, setDbProblem] = useState<DBProblem | null>(null);
    const [host, setHost] = useState<string | null>(null);

    const { width, height } = useWindowSize();
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);

    const username = useGetUsername();
    const socket = useSocket();

    const [isSolved, setIsSolved] = useState(false);

    const { data, isLoading, error } = useGetProblemByIdTitleQuery(idTitle);
    // console.log("data at Workspace:", data)

    const dbProblem = data as DBProblem;
    // console.log("dbProblem at Workspace:", dbProblem)

    useEffect(() => {

        const reconnectToRoom = () => {
            const storedRoomInfo = localStorage.getItem('roomInfo');
            if (storedRoomInfo) {
                const { roomId: storedRoomId, username: storedUsername } = JSON.parse(storedRoomInfo);
                if (storedRoomId === roomId && storedUsername === username) {
                    socket?.emit('joinRoom', { roomId, username }, (response: any) => {
                        if (response.success) {
                            // console.log('Reconnected to room:', roomId);
                        } else {
                            console.error('Failed to reconnect to room:', response.message);
                        }
                    });
                }
            }
        };

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            router.push('/');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // console.log('Workspace - roomId: ', roomId);
        // console.log('Workspace - idTitle: ', idTitle);

        if (socket) {
            reconnectToRoom();

            socket.on('problemChanged', ({ problemId }) => {
                router.push(`/workspace/room/${roomId}/problem/${problemId}`);
            });
        }
        
        // fetchProblemByIdTitle()
        // fetchProblemByIdTitle().then(setDbProblem);

        const idTitles = Object.keys(problems); // Replace with actual logic to get idTitles

        const paths = idTitles.map((idTitle) => ({
            params: { idTitle },
        }));

        // console.log('paths: ', paths);

        // check if the idTitle is in the paths
        const isIdTitleInPaths = paths.some((path) => path.params.idTitle === idTitle);
        // console.log('isIdTitleInPaths: ', isIdTitleInPaths);

        // get the problem from the problems object
        if (isIdTitleInPaths) {
            const problem = problems[idTitle];
            // console.log('problem: ', problem);
            setProblem(problem);
        }   


        // get the host
        if (socket) {
            socket.emit('getHost', { roomId }, (response: any) => {
                if (response.success) {
                    // console.log('response.host: ', response.host);
                setHost(response.host);
            } else {
                console.error(response.message);
            }
            });
        }

        if (socket) {
            socket.on('problemChanged', ({ problemId }) => {
                router.push(`/workspace/room/${roomId}/problem/${problemId}`);
            });
        }
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (socket) {
                socket.off('problemChanged');
            }
        };

    }, [socket, roomId, router]);

    // const fetchProblemByIdTitle = async () => {
    //     const response = await fetch(`http://localhost:3000/api/problem/${idTitle}/user`, {
    //         method: "GET",
    //     });
    //     const data = await response.json();
    //     // console.log("fetchProblemByIdTitle Problem: ", data);
    //     // setIsSolved(data.isSolved);
    //     return data;
    // }

    // const { data: ProblemByIdTitle, isLoading } = useGetProblemByIdTitleQuery(idTitle);
    // console.log("problem by title:", ProblemByIdTitle)

    // 
    // const fetchUserProblemStatus = async () => {
    //     const response = await fetch(`http://localhost:3000/api/problem/solved/${idTitle}`, {
    //         method: "GET",
    //     });
    //     const data = await response.json();
    //     console.log("fetchUserProblemStatus Problem: ", data);
    //     return data;
    // }

    const handleLeaveRoom = () => {
        if (socket && roomId) {
            console.log('Hello');
            console.log('Leaving room: ', roomId);
            socket.emit('leaveRoom', { roomId, username }, (response: any) => {
                if (response.success) {
                    localStorage.removeItem('roomInfo');
                    router.push('/'); // Redirect to homepage after leaving
                } else {
                    console.error(response.message);
                }
            });
        }
    };

    if (!roomId || !idTitle) {
        return <div>Loading...</div>;
    }

    return (

        <div className='h-full'>
            {isLoading ? (
                <div><p>Loading...</p></div>
            ) : (
            <>
                <Topbar/>
                <h1 className="text-center text-2xl font-bold mb-4">Room ID: {roomId} | Problem ID: {idTitle} | Host: {host}</h1>

                <button 
                    onClick={handleLeaveRoom} 
                    className="bg-red-500 px-4 py-2 rounded mb-4"
                >
                    Leave Room
                </button>

                <Split className="split  border-black h-[calc(100vh-130px)]" minSize={0}>
                    {/* <ProblemDescription roomId={roomId} idTitle={idTitle} dbProblem={dbProblem as DBProblem} problem={problem as Problem} isSolved={isSolved} />   */}
                    <ProblemDescription roomId={roomId} idTitle={idTitle} dbProblem={dbProblem} problem={problem as Problem} />  
                    
                    <div className='w-1/2'>
                        <Playground roomId={roomId} idTitle={idTitle} setSuccess={setSuccess} setSolved={setSolved} dbProblem={dbProblem as DBProblem} problem={problem as Problem}/>
                        {/* <Playground roomId={roomId} idTitle={idTitle} setSuccess={setSuccess} setSolved={setSolved}/> */}
                        {success && <Confetti gravity={0.3} tweenDuration={4000} width={width - 1} height={height - 1} />}
                    </div>
                </Split>
            </>
            )}
        </div>
    );
}

export default Workspace;