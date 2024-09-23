import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

type Props = {}

const page = async (props: Props) => {

    const session = await getServerSession(authOptions)
    console.log(session)

    if (session?.user) {
        return (
            <h2>Welcome to admin! {session?.user.username}</h2>
        )
    }

    return (
        <h2>Please login to see this admin page</h2>
    )
}

export default page