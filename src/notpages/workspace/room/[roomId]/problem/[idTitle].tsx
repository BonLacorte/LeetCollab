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
import { Problem } from "@/types/problems";
import { problems } from '@/lib/problems';
import { GetServerSideProps } from 'next';

interface WorkspaceProps {
    params: {
        roomId: string;
        idTitle: string;
    };
}

const Workspace =  ({ params }: WorkspaceProps) => {
    const { roomId, idTitle } = params; // Grab roomId and problemId from the dynamic route
    const router = useRouter();
    const socket = io('http://localhost:8000'); // Adjust the server URL if needed
    const { data: session } = useSession(); // Get the session data
    const [username, setUsername] = useState<string | null>(null);
    const [problem, setProblem] = useState<Problem | null>(null);

    const { width, height } = useWindowSize();
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);

    useEffect(() => {

        console.log('Workspace - roomId: ', roomId);
        console.log('Workspace - idTitle: ', idTitle);

        // Set the username when the session is available
        if (session?.user?.name) {
            setUsername(session.user.name);
        }

        // fetchProblemByIdTitle()
        fetchProblemByIdTitle().then(setProblem);

    }, [roomId, session]);

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
        <div>
            <h1 className="text-center text-2xl font-bold mb-4">Room ID: {roomId} | Problem ID: {idTitle}</h1>

            <button 
                onClick={handleLeaveRoom} 
                className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
                Leave Room
            </button>

            <Split className="split" minSize={0}>
                <ProblemDescription roomId={roomId} idTitle={idTitle} problem={problem as Problem} />  {/* Problem description */}
                
                <div className='w-1/2'>
                    <Playground  /> {/* Coding playground */}
                </div>
            </Split>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { roomId, idTitle } = context.params as { roomId: string; idTitle: string };
    const problem = problems[idTitle];

    if (!problem) {
        return {
            notFound: true,
        };
    }
    problem.handlerFunction = problem.handlerFunction.toString();
    return {
        props: {
            roomId,
            idTitle,
            problem,
        },
    };
}

export default Workspace;

// // fetch the local data
// //  SSG
// // getStaticPaths => it create the dynamic routes
// export async function getStaticPaths() {
// 	// Assuming you have a way to get all roomIds and idTitles
//     const roomIds = Object.keys(problems); // Replace with actual logic to get roomIds
//     const idTitles = Object.keys(problems); // Replace with actual logic to get idTitles

//     const paths = roomIds.flatMap(roomId => 
//         idTitles.map(idTitle => ({
//             params: { roomId, idTitle }
//         }))
//     );

//     return {
//         paths,
//         fallback: false,
//     };
// }

// // getStaticProps => it fetch the data

// export async function getStaticProps({ params }: { params: { idTitle: string } }) {
// 	const { idTitle } = params;
//     console.log(idTitle)
// 	const problem = problems[idTitle];

// 	if (!problem) {
// 		return {
// 			notFound: true,
// 		};
// 	}
// 	problem.handlerFunction = problem.handlerFunction.toString();
// 	return {
// 		props: {
// 			problem,
// 		},
// 	};
// }
