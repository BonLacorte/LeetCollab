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
import Navbar from "@/components/navbar/Navbar";
import { useSocket } from "@/components/SocketProvider";
import { useGetUsername } from "@/hooks/useGetUsername";

const Homepage = () => {

    const username = useGetUsername();
    const socket = useSocket();

    return (
        <>
            <Navbar/>
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">LeetCollab</h1>
                    <p className="text-xl text-muted-foreground">Collaborate and solve coding challenges together</p>
                </header>
                <div className="grid ">
                    <CardJoinRoom socket={socket} username={username}/>
                    <CardProblems socket={socket} username={username}/>
                </div>
            </div>
        </>
    );
}

export default Homepage