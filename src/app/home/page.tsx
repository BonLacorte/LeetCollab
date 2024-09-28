'use client';

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect, useRouter } from "next/navigation";
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
import { Problem } from "@prisma/client";

const Homepage = () => {

    const username = useGetUsername();
    const socket = useSocket();
    const router = useRouter();
    const [inRoom, setInRoom] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [problemIdTitle, setProblemIdTitle] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (socket) {
            socket.emit('isUserInRoom', { username }, (response: { success: boolean, isInRoom: boolean, roomId: string | null, problemTitle: string | undefined }) => {
                if (response.success) {
                    setInRoom(response.isInRoom);
                    setRoomId(response.roomId);
                    setProblemIdTitle(response.problemTitle);
                } else {
                }
            });
        }
    }, [socket, username]);

    const handleJoinRoom = () => {
        if (roomId) {

            router.push(`/workspace/room/${roomId}/problem/${problemIdTitle}`);
        }
    };

    const handleLeaveRoom = () => {
        if (socket && roomId) {
            socket.emit('leaveRoom', { roomId, username }, (response: { success: boolean }) => {
                if (response.success) {
                    setInRoom(false);
                    setRoomId(null);
                }
            });
        }
    };

    return (
        <>
            <Navbar/>
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">LeetCollab</h1>
                    <p className="text-xl text-muted-foreground">Collaborate and solve coding challenges together</p>
                </header>
                {inRoom ? (
                    <div className="text-center">
                        <p className="mb-4">You are currently in room: {roomId}</p>
                        <button onClick={handleJoinRoom} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Join Room</button>
                        <button onClick={handleLeaveRoom} className="bg-red-500 text-white px-4 py-2 rounded">Leave Room</button>
                    </div>
                ) : (
                    <div className="grid">
                        <CardJoinRoom socket={socket} username={username}/>
                        <CardProblems socket={socket} username={username}/>
                    </div>
                )}
            </div>
        </>
    );
}

export default Homepage