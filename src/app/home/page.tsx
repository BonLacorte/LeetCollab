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
import leetCollabLogo from '@/lib/problems/images/leetcollab-no-bg.png';
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

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
        if (!problemIdTitle || problemIdTitle === undefined) {
            // go to home page
            alert("Something went wrong. Leaving room...");
            if (socket && roomId) {
                socket.emit('leaveRoom', { roomId, username }, (response: { success: boolean }) => {
                    if (response.success) {
                        setInRoom(false);
                        setRoomId(null);
                    }
                });
            }
            router.push('/');
        }

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
        // <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <div>
            <Navbar/>
            <div className="">
                <div className="flex w-full xl:w-3/5 lg:w-4/5 flex-col justify-center items-center mx-auto px-4 pt-8">
                    <header className="flex flex-col items-center text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Collaborate and solve coding challenges together</h2>
                        <p className="text-xl text-gray-600">Join a room or create your own to start coding with friends</p>
                        {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">Collaborate and solve coding challenges together</h2>
                        <p className="text-xl text-gray-600 mb-8">Join a room or create your own to start coding with friends</p> */}

                    </header>
                    {inRoom ? (
                        // <div className="text-center">
                        <div className="flex flex-col items-center py-10 gap-4">
                            <p className="text-xl text-gray-600">You are currently in room: {roomId}</p>
                            <div className="flex items-center gap-8">
                                <Button onClick={handleJoinRoom} className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50">Join Room</Button>
                                <Button onClick={handleLeaveRoom} className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50">Leave Room</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* <div className="container mx-auto px-4 pt-8"> */}
                                <CardJoinRoom socket={socket} username={username}/>
                                <CardProblems socket={socket} username={username}/>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Homepage