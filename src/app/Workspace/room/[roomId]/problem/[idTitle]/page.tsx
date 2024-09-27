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
    const [dbProblem, setDbProblem] = useState<DBProblem | null>(null);
    const [host, setHost] = useState<string | null>(null);

    const { width, height } = useWindowSize();
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);

    const username = useGetUsername();
    const socket = useSocket();

    useEffect(() => {

        console.log('Workspace - roomId: ', roomId);
        console.log('Workspace - idTitle: ', idTitle);


        // fetchProblemByIdTitle()
        fetchProblemByIdTitle().then(setDbProblem);

        const idTitles = Object.keys(problems); // Replace with actual logic to get idTitles

        const paths = idTitles.map((idTitle) => ({
            params: { idTitle },
        }));

        console.log('paths: ', paths);

        // check if the idTitle is in the paths
        const isIdTitleInPaths = paths.some((path) => path.params.idTitle === idTitle);
        console.log('isIdTitleInPaths: ', isIdTitleInPaths);

        // get the problem from the problems object
        if (isIdTitleInPaths) {
            const problem = problems[idTitle];
            console.log('problem: ', problem);
            setProblem(problem);
        }   


        // get the host
        if (socket) {
            socket.emit('getHost', { roomId }, (response: any) => {
                if (response.success) {
                    console.log('response.host: ', response.host);
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
            if (socket) {
                socket.off('problemChanged');
            }
        };

    }, [socket, roomId, router]);

    const fetchProblemByIdTitle = async () => {
        const response = await fetch(`http://localhost:3000/api/problem/${idTitle}`, {
            method: "GET",
        });
        const data = await response.json();
        console.log("fetchProblemByIdTitle Problem: ", data);
        return data;
    }

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

    if (!roomId || !idTitle) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Topbar/>
            <h1 className="text-center text-2xl font-bold mb-4">Room ID: {roomId} | Problem ID: {idTitle} | Host: {host}</h1>

            <button 
                onClick={handleLeaveRoom} 
                className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
                Leave Room
            </button>

            <Split className="split" minSize={0}>
                <ProblemDescription roomId={roomId} idTitle={idTitle} dbProblem={dbProblem as DBProblem} problem={problem as Problem} />  {/* Problem description */}
                
                <div className='w-1/2'>
                    <Playground  /> {/* Coding playground */}
                </div>
            </Split>
        </>
    );
}

export default Workspace;