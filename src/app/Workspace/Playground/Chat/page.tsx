import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/components/SocketProvider';
import { useGetUsername } from '@/hooks/useGetUsername';
import { Message } from '@/types/problems';
import { Send } from 'lucide-react';

type ChatProps = {
    roomId: string;
};

const Chat: React.FC<ChatProps> = ({ roomId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const socket = useSocket();
    const username = useGetUsername();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (socket) {
            // Fetch chat history when component mounts
            socket.emit('getChatHistory', { roomId }, (history: Message[]) => {
                setMessages(history);
            });

            socket.on('chatMessage', (message: Message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            });

            socket.on('chatHistory', (history: Message[]) => {
                setMessages(history);
            });
        }

        return () => {
            if (socket) {
                socket.off('chatMessage');
                socket.off('chatHistory');
            }
        };
    }, [socket, roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim() && socket && username) {
            const newMessage: Message = {
                sender: username,
                content: inputMessage.trim(),
                timestamp: new Date(),
            };
            socket.emit('sendMessage', { roomId, message: newMessage });
            setInputMessage('');
        }
    };

    return (
        <div className="flex flex-col overflow-auto h-[35vh]">
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 h-[calc(100vh-200px)]"
            >
                {messages.map((message, index) => {
                    const isOwnMessage = message.sender === username;
                    const showSender = index === 0 || messages[index - 1].sender !== message.sender;

                    return (
                        <div key={index} className={`mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {!isOwnMessage && showSender && (
                            <div className="mt-3 text-sm text-gray-500">{message.sender}</div>
                        )}
                        <div className={`inline-block p-2 rounded-2xl ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            {message.content}
                        </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-2 border-t">
                <div className="flex justify-between ">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="flex-1 p-2 mr-2 border rounded-2xl"
                        placeholder="Type a message..."
                    />
                    <button type="submit" className="bg-gray-500 text-white p-2 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;