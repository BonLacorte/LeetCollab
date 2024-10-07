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
import { Moon, Sun } from 'lucide-react';

const Topbar = () => {
    const username = useGetUsername();
    const pathname = usePathname();
    const [isHost, setIsHost] = useState(false);
    const [currentProblem, setCurrentProblem] = useState<any>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [idTitle, setIdTitle] = useState<string | null>(null);

    const isWorkspacePage = pathname?.startsWith('/workspace/room/');
    
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
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

    }, [pathname, username, idTitle]);



    const handleProblemChange = (isForward: boolean) => {
        if (!isHost || !currentProblem || !roomId) return;

        const direction = isForward ? 1 : -1;
        const nextProblemOrder = currentProblem.order + direction;
        const nextProblemKey = Object.keys(problems).find((key) => problems[key].order === nextProblemOrder);

        if (nextProblemKey) {
            const nextProblem = problems[nextProblemKey];
            
            // Emit socket event to change problem for all users in the room
            console.log("changeProblem called");
            console.log("changeProblem - roomId: ", roomId);
            console.log('changeProblem - problemId: ', nextProblem.id);
            console.log('changeProblem - selectedProblem: ', nextProblem);
            socket?.emit('changeProblem', { roomId, problemId: nextProblem.id, selectedProblem: nextProblem }, (response: any) => {
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

    return (
        <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
            <div className={`flex w-full items-center justify-between ${isWorkspacePage ? "max-w-[1200px] mx-auto" : ""}`}>
                
                {/* LEFT SIDE */}
                <Link href='/' className='h-[22px] flex-1'>
                    <img src='/logo-full.png' alt='Logo' className='h-full' />
                </Link>

                {/* MIDDLE SIDE */}
                {isWorkspacePage && (
                    <div className='flex items-center gap-4 flex-1 justify-center'>
                        <div 
                            className={`flex items-center justify-center rounded bg-dark-fill-3 h-8 w-8 ${isHost ? 'hover:bg-dark-fill-2 cursor-pointer' : 'opacity-50'}`}
                            onClick={() => handleProblemChange(false)}
                        >
                            <FaChevronLeft/>
                        </div>
                        <Link href='/' className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer'>
                            <div>
                                <BsList />
                            </div>
                            <p>Problem List</p>
                        </Link>
                        <div 
                            className={`flex items-center justify-center rounded bg-dark-fill-3 h-8 w-8 ${isHost ? 'hover:bg-dark-fill-2 cursor-pointer' : 'opacity-50'}`}
                            onClick={() => handleProblemChange(true)}
                        >
                            <FaChevronRight />
                        </div>
                    </div>
                )}

                {/* RIGHT SIDE */}
                <div className="flex justify-between items-center gap-5">
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
                    <div className='flex items-center space-x-4 flex-1 justify-end'>
                        {/* Add your existing navbar items here */}
                        {username ? (
                            <UserAccountNav user={{ name: username }} />
                        ) : (
                            <Link href="/sign-in">
                                <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Topbar