'use client'

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BsList } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { problems } from '@/lib/problems'; // Adjust the import path as needed
import { useSocket } from '@/components/SocketProvider';
import { useGetUsername } from '@/hooks/useGetUsername';
import UserAccountNav from '../navbar/UserAccountNav';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode } from '@/app/state';
import { Menu, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import leetCollabLogo from '@/lib/problems/images/leetcollab-no-bg.png';
import Timer from '../workspace/Timer';
import { Button } from '../ui/button';

const Topbar = ({ host }: { host: string }) => {
    const username = useGetUsername();
    const pathname = usePathname();
    const [isHost, setIsHost] = useState(false);
    const [currentProblem, setCurrentProblem] = useState<any>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [idTitle, setIdTitle] = useState<string | null>(null);
    // const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isWorkspacePage = pathname?.startsWith('/workspace/room/');
    
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: session } = useSession();
    const toggleDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    }

    const socket = useSocket();
    const router = useRouter();

    useEffect(() => {

        const pathParts = pathname?.split('/');
            const currentRoomId = pathParts?.[3];
            const currentIdTitle = pathParts?.[5];

            setRoomId(currentRoomId);
            setIdTitle(currentIdTitle);

            if (socket && currentRoomId) {
            socket.emit('getHost', { roomId: currentRoomId }, (response: any) => {
                if (response.success) {
                    setIsHost(response.host === username);
                    }
                });
            }

            if (idTitle) {
                setCurrentProblem(problems[idTitle]);
            }

    }, [socket, pathname, username, idTitle]);



    const handleProblemChange = (isForward: boolean) => {
        if (!isHost || !currentProblem || !roomId) return;

        const currentOrder = currentProblem.order;
    
        // Find the next or previous problem
        const problemsArray = Object.values(problems);
        let nextProblem;

        if (isForward) {
            nextProblem = problemsArray
                .filter(p => p.order > currentOrder)
                .sort((a, b) => a.order - b.order)[0];
        } else {
            nextProblem = problemsArray
                .filter(p => p.order < currentOrder)
                .sort((a, b) => b.order - a.order)[0];
        }

        if (nextProblem) {
            // const nextProblem = problems[nextProblemKey];
            
            // Emit socket event to change problem for all users in the room
            console.log("changeProblem called");
            // console.log("changeProblem - roomId: ", roomId);
            // console.log('changeProblem - problemId: ', nextProblem.id);
            // console.log('changeProblem - selectedProblem: ', nextProblem);
            socket?.emit('changeProblem', { roomId, problemId: nextProblem.id, selectedProblem: nextProblem, starterCode: nextProblem.starterCode }, (response: any) => {
                if (response.success) {
                    // Update local state
                    setCurrentProblem(nextProblem);
                    setIdTitle(nextProblem.id);
                    
                    // Navigate to the new problem URL
                    router.push(`/workspace/room/${roomId}/problem/${nextProblem.id}`);
                } else {
                    console.error('Failed to change problem:', response.message);
                    // Optionally, show an error message to the user
                }
            });
        }
    };

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

    return (
        <div className='flex justify-between items-center w-full h-full px-4 py-6 bg-white shadow-md'>
            
            {/* LEFT SIDE */}
            <div className='w-1/2 flex flex-row justify-between items-center gap-4'>
                <Link href='/' className=''>
                    {/* Leetcode logo */}
                    <div className='flex col items-center space-x-2'>
                        <Image src={leetCollabLogo} alt="Leetcode" width={24} height={24} />
                        <h1 className="text-3xl font-bold text-gray-900 hidden md:flex">LeetCollab</h1>
                    </div>
                </Link>

                {isWorkspacePage && (
                    <div className='w-1/2 flex gap-4 flex-1'>
                        <button 
                            className={`flex items-center justify-center md:px-4 px-2 py-2 rounded-3xl transition-all duration-300 ${
                                isHost 
                                    ? 'bg-gray-900 hover:bg-gray-800  text-white cursor-pointer' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => isHost && handleProblemChange(false)}
                            disabled={!isHost}
                        >
                            <FaChevronLeft className="md:mr-2" />
                            <span className="hidden md:block font-medium">Prev</span>
                        </button>
                        <div className='hidden md:flex'>
                            <Timer />
                        </div>
                        <button 
                            className={`flex items-center justify-center md:px-4 px-2 py-2 rounded-3xl transition-all duration-300 ${
                                isHost 
                                    ? 'bg-gray-900 hover:bg-gray-800  text-white cursor-pointer' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => isHost && handleProblemChange(true)}
                            disabled={!isHost}
                        >
                            <span className="hidden md:block font-medium">Next</span>
                            <FaChevronRight className="md:ml-2" />
                        </button>
                    </div>
                )}
            </div>

            {/* MIDDLE SIDE */}
            

            {/* RIGHT SIDE */}
            <div className="w-1/2 flex justify-end items-center gap-5">
                <div className='flex-col hidden lg:flex'>
                    <h1 className="text-2xl font-bold ">Room ID: {roomId} | Host: {host}</h1>
                </div>
                <div className='flex-col hidden lg:flex'>
                    <Button 
                        onClick={handleLeaveRoom} 
                        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                    >
                        Leave Room
                    </Button>
                </div>

                <hr className="hidden lg:block w-0 h-7 border border-solid border-l border-gray-300 mx-3" />

                <div>
                    {/* <Sun className="cursor-pointer text-gray-500" size={24} /> */}
                    <button 
                        onClick={toggleDarkMode}
                    >
                        {isDarkMode ? (
                            <Sun className="cursor-pointer text-gray-500" size={24} />
                        ) : (
                            <Moon className="cursor-pointer text-gray-500" size={24} />
                        )}
                    </button>
                </div>

                <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />

                <div className='flex items-center space-x-4'>
                    {username ? (
                        <UserAccountNav user={{ name: username, id: session?.user?.id }} />
                    ) : (
                        <Link href="/sign-in">
                            <button className='bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50'>
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Topbar