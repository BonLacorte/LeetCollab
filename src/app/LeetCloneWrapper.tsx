import React, { useEffect } from 'react'
import Navbar from '@/components/navbar/Navbar'

const LeetCloneWrapper = ({children} : {children: React.ReactNode}) => {

    return (
        <div>
            <Navbar/>
            {children}
        </div>
    )
}
export default LeetCloneWrapper