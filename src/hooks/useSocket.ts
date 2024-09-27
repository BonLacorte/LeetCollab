// src/hooks/useSocket.ts

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'; 

const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Establish the socket connection
        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');

        setSocket(socketInstance);

        // Handle connection and disconnection
        socketInstance.on('connect', () => {
            console.log('Connected to the server with ID:', socketInstance.id);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });

        // Cleanup the socket connection when component unmounts or roomId changes
        return () => {
            socketInstance.disconnect();
        };
    }, []); // Reconnect if roomId changes

    return socket;
};

export default useSocket;
