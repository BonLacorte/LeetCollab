'use client';

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import CardProblems from "./CardProblems";
import CardJoinRoom from "./CardJoinRoom";
import { io, Socket } from 'socket.io-client'; // Importing Socket.IO client
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {}

const Homepage = (props: Props) => {
    // const session = await getServerSession(authOptions)

    // // if session is not present, redirect to sign-in page
    // if (!session) {
    //     redirect("/sign-in")
    // }

    const { data: session } = useSession(); // Get the session data
    const [username, setUsername] = useState<string | null>(null);

    const [socket, setSocket] = useState<Socket | null>(null);  

    useEffect(() => {

        // Set the username when the session is available
        if (session?.user?.name) {
            setUsername(session.user.name);
        }

        const newSocket = io('http://localhost:8000'); // Connect to the backend
        setSocket(newSocket);

        return () => {
            if (socket) {
                socket.emit('leaveRoom')
                newSocket.close();
            }
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">LeetCollab</h1>
                <p className="text-xl text-muted-foreground">Collaborate and solve coding challenges together</p>
            </header>
            <div className="grid ">
                <CardJoinRoom socket={socket} />
                <CardProblems socket={socket} username={username}/>
            </div>
        </div>
    );
}

export default Homepage