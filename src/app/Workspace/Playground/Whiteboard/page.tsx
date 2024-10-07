import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/components/SocketProvider';

type WhiteboardProps = {
    roomId: string;
};

const Whiteboard: React.FC<WhiteboardProps> = ({ roomId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [color, setColor] = useState('#000000');
    const [size, setSize] = useState(5);
    const socket = useSocket();

    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;

        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!socket) return;
    
        socket.emit('getWhiteboardState', { roomId }, drawWhiteboardState);
    
        socket.on('draw', ({ x, y, color, size, tool, isNewStroke }) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (!canvas || !context) return;
    
            context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
            context.lineWidth = size;
            if (isNewStroke) {
                context.beginPath();
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
                context.stroke();
            }
        });
    
        socket.on('clearCanvas', () => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (!canvas || !context) return;
    
            context.clearRect(0, 0, canvas.width, canvas.height);
        });
    
        socket.on('whiteboardStateUpdated', drawWhiteboardState);
    
        return () => {
            socket.off('draw');
            socket.off('clearCanvas');
            socket.off('whiteboardStateUpdated');
        };
    }, [socket, roomId, scale, offset]);

    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
    
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
    
            // Redraw the canvas content after resizing
            socket?.emit('getWhiteboardState', { roomId }, (whiteboardState: any) => {
                const context = canvas.getContext('2d');
                if (!context) return;
    
                context.clearRect(0, 0, canvas.width, canvas.height);
                let lastStroke: { x: number, y: number } | null = null;
    
                whiteboardState.forEach(({ x, y, color, size, tool, isNewStroke }: { x: number; y: number; color: string; size: number; tool: 'pen' | 'eraser'; isNewStroke: boolean }) => {
                    context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
                    context.lineWidth = size;
    
                    if (isNewStroke || !lastStroke) {
                        context.beginPath();
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                        context.stroke();
                    }
    
                    lastStroke = { x, y };
                });
            });
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [socket, roomId]);

    const drawWhiteboardState = (whiteboardState: any) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;
    
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(scale, 0, 0, scale, offset.x, offset.y);
    
        let lastStroke: { x: number, y: number } | null = null;
    
        whiteboardState.forEach(({ x, y, color, size, tool, isNewStroke }: { x: number; y: number; color: string; size: number; tool: 'pen' | 'eraser'; isNewStroke: boolean }) => {
            context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
            context.lineWidth = size / scale;
    
            if (isNewStroke || !lastStroke) {
                context.beginPath();
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
                context.stroke();
            }
    
            lastStroke = { x, y };
        });
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.buttons === 2) { // Right mouse button
            setIsDragging(true);
            setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
        } else {
            setIsDrawing(true);
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (!canvas || !context) return;
    
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - offset.x) / scale;
            const y = (e.clientY - rect.top - offset.y) / scale;
    
            context.beginPath();
            context.moveTo(x, y);
            socket?.emit('draw', { roomId, x, y, color, size, tool, isNewStroke: true });
        }
    };
    
    const stopDrawing = () => {
        setIsDrawing(false);
        setIsDragging(false);
    };
    
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDragging) {
            const newOffsetX = e.clientX - dragStart.x;
            const newOffsetY = e.clientY - dragStart.y;
            setOffset({ x: newOffsetX, y: newOffsetY });
            socket?.emit('getWhiteboardState', { roomId }, drawWhiteboardState);
        } else if (isDrawing) {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (!canvas || !context) return;
    
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - offset.x) / scale;
            const y = (e.clientY - rect.top - offset.y) / scale;
    
            context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
            context.lineWidth = size / scale;
            context.lineCap = 'round';
            context.lineTo(x, y);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y);
    
            socket?.emit('draw', { roomId, x, y, color, size, tool, isNewStroke: false });
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;
    
        context.clearRect(0, 0, canvas.width, canvas.height);
        socket?.emit('clearCanvas', { roomId });
        socket?.emit('saveWhiteboardState', { roomId, state: [] });
    };

    const handleZoom = (event: React.WheelEvent<HTMLCanvasElement>) => {
        event.preventDefault();
        const zoomIntensity = 0.1;
        const wheel = event.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomIntensity);
        
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        const newScale = scale * zoom;
        const newOffsetX = offset.x - (mouseX / scale - mouseX / newScale) * newScale;
        const newOffsetY = offset.y - (mouseY / scale - mouseY / newScale) * newScale;
    
        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
    
        socket?.emit('getWhiteboardState', { roomId }, drawWhiteboardState);
    };

    return (
        <div className="flex flex-col border-red-500 h-full">
            <div className="flex justify-between">
                <div>
                    <button
                        onClick={() => setTool('pen')}
                        className={`px-2 py-1 mr-2 ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Pen
                    </button>
                    {/* <button
                        onClick={() => setTool('eraser')}
                        className={`px-2 py-1 ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Eraser
                    </button> */}
                </div>
                <div>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="mr-2"
                    />
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="mr-2"
                    />
                    <button onClick={clearCanvas} className="px-2 py-1 bg-red-500 text-white">
                        Clear All
                    </button>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
                onWheel={handleZoom}
                onContextMenu={(e) => e.preventDefault()}
                className="border border-gray-300 flex-grow cursor-crosshair"
            />
        </div>
    );
};

export default Whiteboard;