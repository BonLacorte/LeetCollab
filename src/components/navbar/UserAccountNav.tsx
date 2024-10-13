'use client'

import { signOut, useSession } from 'next-auth/react'
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
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation';
import { useGetUserProfileQuery } from '@/app/state/api'

type Props = {
    user: {
        name?: string | null,
        id?: string | null
    }
}

const UserAccountNav = ({ user }: Props) => {
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const router = useRouter();

    const handleSignOut = () => {
        signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/sign-in`
        })
    }

    const { data: userProfile, isLoading: userProfileIsLoading, error: userProfileError } = useGetUserProfileQuery(user?.id || '');

    const { data: session } = useSession();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50'>
                        {userProfile?.username}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-gray-100 bg-gray-100 w-56 border-gray-300 rounded-xl">
                    <DropdownMenuItem>
                        <Link href={`/profile/${user?.id}`} className="w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsAlertOpen(true)}>
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be redirected to the sign-in page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSignOut}>
                            Sign out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default UserAccountNav