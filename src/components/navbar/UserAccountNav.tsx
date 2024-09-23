'use client'

import { signOut } from 'next-auth/react'
import React, { useState } from 'react'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Props = {
    user: {
        name?: string | null
    }
}

const UserAccountNav = ({ user }: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
                {user.name}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                    <Link href="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="w-full text-left">Sign out</button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                                <AlertDialogDescription>
                                You will be redirected to the sign-in page.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => signOut({
                                    redirect: true,
                                    callbackUrl: `${window.location.origin}/sign-in`
                                    })}>
                                    Sign out
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav