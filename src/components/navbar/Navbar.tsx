import { authOptions } from '@/lib/auth';
import { Menu, Moon, Sun } from 'lucide-react'
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react'
import UserAccountNav from '@/components/navbar/UserAccountNav';
import { useSession } from 'next-auth/react';
import { useGetUsername } from '@/hooks/useGetUsername';

const Navbar = () => {
    const username = useGetUsername();

    return (
        <div className='flex justify-between items-center w-full mb-7'>
            {/* LEFT SIDE */}
            <div className='flex justify-between items-center gap-5'>
                <Link href='/'>
                    <Menu className='w-4 h-4' />
                </Link>
                <div className="relative">
                    <input
                        type="search"
                        placeholder="Start type to search groups & products"
                        className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                {/* sign */}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-between items-center gap-5">
                <div className="hidden md:flex justify-between items-center gap-5">
                    <div>
                        <Sun className="cursor-pointer text-gray-500" size={24} />
                        {/* <button 
                            onClick={toggleDarkMode}
                        >
                            {isDarkMode ? (
                                <Sun className="cursor-pointer text-gray-500" size={24} />
                            ) : (
                                <Moon className="cursor-pointer text-gray-500" size={24} />
                            )}
                        </button> */}
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
                {/* <Link href="/settings">
                    <Settings className="cursor-pointer text-gray-500" size={24} />
                </Link> */}
            </div>
        </div>
    )
}

export default Navbar