'use client'

import React, { useEffect } from 'react'
import Navbar from '@/components/navbar/Navbar'
import { usePathname } from 'next/navigation';
import Topbar from '@/components/topbar/Topbar';
import StoreProvider, { useAppSelector } from './redux';

const LeetCloneLayout = ({children} : {children: React.ReactNode}) => {

    const pathname = usePathname();
    const isWorkspacePage = pathname?.startsWith('/workspace/room/'); 

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.add('light');
        }
    }, [isDarkMode]);

    return (
        <div
            className={`${
                isDarkMode ? "dark" : "light"
            } flex flex-col bg-gray-50 text-gray-900 w-full min-h-screen`}
        >
            {/* {isWorkspacePage ? <Topbar/> : <Navbar/>} */}
            {children}
        </div>
    )
}

const LeetCloneWrapper = ({children} : {children: React.ReactNode}) => {

    

    return (
        <StoreProvider>
            <LeetCloneLayout>
                {children}
            </LeetCloneLayout>
        </StoreProvider>
    )
}
export default LeetCloneWrapper