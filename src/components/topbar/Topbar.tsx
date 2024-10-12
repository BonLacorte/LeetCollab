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
                <Link href='/' className='hidden md:flex'>
                    {/* Leetcode logo */}
                    <div className='flex col items-center space-x-2'>
                        <Image src={leetCollabLogo} alt="Leetcode" width={24} height={24} />
                        <h1 className="text-3xl font-bold text-gray-900">LeetCollab</h1>
                    </div>
                </Link>

                {isWorkspacePage && (
                    <div className='w-1/2 flex gap-4 flex-1'>
                        <button 
                            className={`flex items-center justify-center px-4 py-2 rounded-3xl transition-all duration-300 ${
                                isHost 
                                    ? 'bg-gray-900 hover:bg-gray-800  text-white cursor-pointer' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => isHost && handleProblemChange(false)}
                            disabled={!isHost}
                        >
                            <FaChevronLeft className="mr-2" />
                            <span className="font-medium">Prev</span>
                        </button>
                        <Timer />
                        <button 
                            className={`flex items-center justify-center px-4 py-2 rounded-3xl transition-all duration-300 ${
                                isHost 
                                    ? 'bg-gray-900 hover:bg-gray-800  text-white cursor-pointer' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => isHost && handleProblemChange(true)}
                            disabled={!isHost}
                        >
                            <span className="font-medium">Next</span>
                            <FaChevronRight className="ml-2" />
                        </button>
                    </div>
                )}
            </div>

            {/* MIDDLE SIDE */}
            

            {/* RIGHT SIDE */}
            <div className="w-1/2 flex justify-end items-center gap-5">
                <div className='flex-col hidden md:flex'>
                    <h1 className="text-2xl font-bold ">Room ID: {roomId} | Host: {host}</h1>
                </div>
                <div>
                    <Button 
                        onClick={handleLeaveRoom} 
                        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                    >
                        Leave Room
                    </Button>
                </div>

                <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />

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
                    {/* Add your existing navbar items here */}
                    {username ? (
                        <UserAccountNav user={{ name: username }} />
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
        // <nav className='bg-white shadow-md'>
        //     <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        //         <div className='flex justify-between h-16'>
        //             <div className='flex'>
        //                 <Link href='/' className='flex-shrink-0 flex items-center'>
        //                     <Image src={leetCollabLogo} alt="LeetCollab" width={24} height={24} />
        //                     <h1 className="text-xl font-bold text-gray-900 ml-2 hidden sm:block">LeetCollab</h1>
        //                 </Link>
        //             </div>

        //             {isWorkspacePage && (
        //                 <div className='hidden md:flex items-center space-x-4'>
        //                     <button 
        //                         className={`flex items-center justify-center px-3 py-1 rounded-full transition-all duration-300 ${
        //                             isHost 
        //                                 ? 'bg-gray-900 hover:bg-gray-800 text-white cursor-pointer' 
        //                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        //                         }`}
        //                         onClick={() => isHost && handleProblemChange(false)}
        //                         disabled={!isHost}
        //                     >
        //                         <FaChevronLeft className="mr-1" />
        //                         <span className="text-sm">Prev</span>
        //                     </button>
        //                     <Timer />
        //                     <button 
        //                         className={`flex items-center justify-center px-3 py-1 rounded-full transition-all duration-300 ${
        //                             isHost 
        //                                 ? 'bg-gray-900 hover:bg-gray-800 text-white cursor-pointer' 
        //                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        //                         }`}
        //                         onClick={() => isHost && handleProblemChange(true)}
        //                         disabled={!isHost}
        //                     >
        //                         <span className="text-sm">Next</span>
        //                         <FaChevronRight className="ml-1" />
        //                     </button>
        //                 </div>
        //             )}

        //             <div className='hidden md:flex items-center space-x-4'>
        //                 <p className="text-sm text-gray-600">Room: {roomId} | Host: {host}</p>
        //                 <Button 
        //                     onClick={handleLeaveRoom} 
        //                     className="bg-gray-900 hover:bg-gray-800 text-white text-sm py-1 px-3 rounded-lg"
        //                 >
        //                     Leave Room
        //                 </Button>
        //                 <button onClick={toggleDarkMode}>
        //                     {isDarkMode ? (
        //                         <Sun className="cursor-pointer text-gray-500" size={20} />
        //                     ) : (
        //                         <Moon className="cursor-pointer text-gray-500" size={20} />
        //                     )}
        //                 </button>
        //                 {username ? (
        //                     <UserAccountNav user={{ name: username }} />
        //                 ) : (
        //                     <Link href="/sign-in">
        //                         <button className='bg-gray-900 hover:bg-gray-800 text-white text-sm py-1 px-3 rounded-lg'>
        //                             Sign In
        //                         </button>
        //                     </Link>
        //                 )}
        //             </div>

        //             <div className='md:hidden flex items-center'>
        //                 <button
        //                     onClick={() => setIsMenuOpen(!isMenuOpen)}
        //                     className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
        //                 >
        //                     <Menu className="h-6 w-6" aria-hidden="true" />
        //                 </button>
        //             </div>
        //         </div>
        //     </div>

        //     {isMenuOpen && (
        //         <div className='md:hidden'>
        //             <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
        //                 {isWorkspacePage && (
        //                     <div className='flex justify-center space-x-2 mb-2'>
        //                         <button 
        //                             className={`flex items-center justify-center px-2 py-1 rounded-full text-xs transition-all duration-300 ${
        //                                 isHost 
        //                                     ? 'bg-gray-900 hover:bg-gray-800 text-white cursor-pointer' 
        //                                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        //                             }`}
        //                             onClick={() => isHost && handleProblemChange(false)}
        //                             disabled={!isHost}
        //                         >
        //                             <FaChevronLeft className="mr-1" />
        //                             Prev
        //                         </button>
        //                         <Timer />
        //                         <button 
        //                             className={`flex items-center justify-center px-2 py-1 rounded-full text-xs transition-all duration-300 ${
        //                                 isHost 
        //                                     ? 'bg-gray-900 hover:bg-gray-800 text-white cursor-pointer' 
        //                                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        //                             }`}
        //                             onClick={() => isHost && handleProblemChange(true)}
        //                             disabled={!isHost}
        //                         >
        //                             Next
        //                             <FaChevronRight className="ml-1" />
        //                         </button>
        //                     </div>
        //                 )}
        //                 <p className="text-sm text-gray-600 text-center">Room: {roomId} | Host: {host}</p>
        //                 <div className='flex justify-center'>
        //                     <Button 
        //                         onClick={handleLeaveRoom} 
        //                         className="bg-gray-900 hover:bg-gray-800 text-white text-sm py-1 px-3 rounded-lg"
        //                     >
        //                         Leave Room
        //                     </Button>
        //                 </div>
        //                 <div className='flex justify-center space-x-4'>
        //                     <button onClick={toggleDarkMode}>
        //                         {isDarkMode ? (
        //                             <Sun className="cursor-pointer text-gray-500" size={20} />
        //                         ) : (
        //                             <Moon className="cursor-pointer text-gray-500" size={20} />
        //                         )}
        //                     </button>
        //                     {username ? (
        //                         <UserAccountNav user={{ name: username }} />
        //                     ) : (
        //                         <Link href="/sign-in">
        //                             <button className='bg-gray-900 hover:bg-gray-800 text-white text-sm py-1 px-3 rounded-lg'>
        //                                 Sign In
        //                             </button>
        //                         </Link>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>
        //     )}
        // </nav>
    );
}

export default Topbar