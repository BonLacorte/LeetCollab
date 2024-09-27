'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:8000'); // Your Socket.IO server URL
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

// Move the useSocket hook inside a component
export const SocketConsumer: React.FC<{ children: (socket: Socket | null) => React.ReactNode }> = ({ children }) => {
    const socket = useContext(SocketContext);
    return <>{children(socket)}</>;
};

// Create a custom hook to use the socket
export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (socket === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
};