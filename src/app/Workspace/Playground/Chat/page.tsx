import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/components/SocketProvider';
import { useGetUsername } from '@/hooks/useGetUsername';
import { Message } from '@/types/problems';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        <div className="flex flex-col w-full h-[30vh]">
            {/* Chat container */}
            <ScrollArea 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-2 h-[28vh]"
            >
                {messages.map((message, index) => {
                    const isOwnMessage = message.sender === username;
                    const showSender = index === 0 || messages[index - 1].sender !== message.sender;

                    return (
                        <div key={index} className={`mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {!isOwnMessage && showSender && (
                            <div className="mt-3 text-sm text-gray-500">{message.sender}</div>
                        )}
                        <div className={`inline-block p-2 rounded-2xl ${isOwnMessage ? 'bg-gray-800 text-white' : 'bg-gray-200'} text-gray-900`}>
                            {message.content}
                        </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Chat input */}
            <form onSubmit={sendMessage} className="border-t border-gray-200 flex justify-between w-full ">
                <div className="flex justify-between w-full mt-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="w-full p-2 mr-2 border rounded-2xl text-gray-900 bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="Type a message..."
                    />
                    <button type="submit" className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;