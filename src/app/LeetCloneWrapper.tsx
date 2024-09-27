'use client'

import React, { useEffect } from 'react'
import Navbar from '@/components/navbar/Navbar'
import { usePathname } from 'next/navigation';
import Topbar from '@/components/topbar/Topbar';

const LeetCloneWrapper = ({children} : {children: React.ReactNode}) => {

    const pathname = usePathname();
    const isWorkspacePage = pathname?.startsWith('/workspace/room/'); 

    return (
        <div>
            {/* {isWorkspacePage ? <Topbar/> : <Navbar/>} */}
            {children}
        </div>
    )
}
export default LeetCloneWrapper