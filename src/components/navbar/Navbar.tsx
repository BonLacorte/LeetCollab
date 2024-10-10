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

const Navbar = () => {
    const username = useGetUsername();
    const dispatch = useAppDispatch();

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const toggleDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    }

    return (
        <div className='flex justify-between items-center w-full mb-7'>
            {/* LEFT SIDE */}
            <div className='flex flex-row justify-between items-center'>
                <Link href='/'>
                    {/* Leetcode logo */}
                    <div className='flex items-center mx-4'>
                        <Image src={leetCollabLogo} alt="Leetcode" width={24} height={24} />
                    </div>
                </Link>
                <span className='font-semibold'>LeetCollab</span>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-between items-center gap-5">
                <div className="hidden md:flex justify-between items-center gap-5">
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
                    {/* Image */}
                    {/* <div className="flex items-center gap-3 cursor-pointer">
                        <Image
                        src="https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/profile.jpg"
                        alt="Profile"
                        width={50}
                        height={50}
                        className="rounded-full h-full object-cover"
                        />
                        <span className="font-semibold">Bon Lacorte</span>
                    </div> */}

                    <div className='flex items-center space-x-4 flex-1 justify-end'>
                        {/* Sign In/Sign Out/Sign Up */}
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
        </div>
    )
}

export default Navbar