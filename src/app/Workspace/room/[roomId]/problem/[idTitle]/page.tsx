'use client';

import Playground from '@/app/workspace/Playground/page';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';

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
                <div className='flex justify-center items-center min-h-screen'>
                    <div className="flex flex-col justify-center items-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                        <p className='text-lg font-medium text-gray-900 mt-4'>Loading...</p>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col gap-4 lg:gap-8'>
                    
                    <Topbar host={host || ''}/>

                    <div className='lg:hidden flex justify-between px-8'>
                        <h1 className="text-2xl font-bold ">Room ID: {roomId} | Host: {host}</h1>
                        <div>
                            <Button 
                                onClick={handleLeaveRoom} 
                                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                            >
                                Leave Room
                            </Button>
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-row gap-8 mx-8 lg:mx-0'>
                        <div className='w-full lg:w-1/2 h-full lg:h-[50vh] bg-white lg:ml-8 shadow-xl rounded-xl'>
                            <Description
                                idTitle={idTitle}
                                dbProblem={dbProblem}
                                problem={problem}
                            />
                        </div>
                        
                        <div className='w-full lg:w-1/2 h-full'>
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