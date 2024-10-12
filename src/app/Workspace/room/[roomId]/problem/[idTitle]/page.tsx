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
import Description from '@/app/workspace/ProblemDescription/Description/page';
import { Link } from 'lucide-react';
import Image from 'next/image';
import leetCollabLogo from '@/lib/problems/images/leetcollab-no-bg.png';

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

        // <div className='border border-green-500'>
        <>
            <div className='minh-screen'>
            {isLoading ? 
            (
                <div><p>Loading...</p></div>
            ) : (
                <div className='flex flex-col gap-4 md:gap-8'>
                    
                    <Topbar host={host || ''}/>
                    <div className='md:hidden flex px-8'>
                        <h1 className="text-2xl font-bold ">Room ID: {roomId} | Host: {host}</h1>
                    </div>
                    <div className='flex flex-col md:flex-row gap-8'>
                        <div className='w-full md:w-1/2 h-[50vh] bg-white ml-8 shadow-xl rounded-xl'>
                            <Description
                                idTitle={idTitle}
                                dbProblem={dbProblem}
                                problem={problem}
                            />
                        </div>
                        
                        <div className='w-full md:w-1/2 h-full'>
                            <Playground roomId={roomId} idTitle={idTitle} setSuccess={setSuccess} setSolved={setSolved} dbProblem={dbProblem as DBProblem} problem={problem as Problem}/>
                            {/* <Playground roomId={roomId} idTitle={idTitle} setSuccess={setSuccess} setSolved={setSolved}/> */}
                            {success && <Confetti gravity={0.3} tweenDuration={4000} width={width - 1} height={height - 1} />}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </>
    );
}

export default Workspace;