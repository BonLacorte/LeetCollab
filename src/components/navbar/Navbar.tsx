import { authOptions } from '@/lib/auth';
import { Menu, Moon, Sun } from 'lucide-react'
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react'
import UserAccountNav from '@/components/navbar/UserAccountNav';
import { useSession } from 'next-auth/react';
import { useGetUsername } from '@/hooks/useGetUsername';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode } from '@/app/state';
import Image from 'next/image';
import leetCollabLogo from '@/lib/problems/images/leetcollab-no-bg.png';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';

const Navbar = () => {
    const username = useGetUsername();
    const dispatch = useAppDispatch();

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: session } = useSession();

    const toggleDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    }

    return (
        <div className='flex w-full justify-center bg-white shadow-md'>
            <div className='flex w-full xl:w-3/5 lg:w-4/5 justify-between items-center px-4 py-6  '>
                {/* LEFT SIDE */}
                <div className='flex flex-row justify-between items-center'>
                    <Link href='/'>
                        {/* Leetcode logo */}
                        <div className='flex col items-center space-x-2'>
                            <Image src={leetCollabLogo} alt="Leetcode" width={24} height={24} />
                            <h1 className="text-3xl font-bold text-gray-900">LeetCollab</h1>
                        </div>
                    </Link>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex justify-between items-center gap-5">
                    <div className="flex justify-between items-center gap-5">
                        <div>
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

                        <div className='flex items-center space-x-4 flex-1 justify-end'>

                            {username ? (
                                <UserAccountNav user={{ name: username, id: session?.user?.id }} />
                            ) : (
                                <Link href="/sign-in">
                                    <Button className='bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50'>
                                        Sign In
                                    </Button>
                                </Link>
                            )}                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar