import React, { useEffect, useState } from 'react'
import { FiClock, FiPause, FiPlay, FiRefreshCw, FiX } from 'react-icons/fi'

const Timer: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
        interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const toggleExpand = () => setIsExpanded(!isExpanded);
    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setTime(0);
        setIsRunning(false);
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isExpanded) {
        return (
        <button onClick={toggleExpand} className="p-2 rounded-full text-gray-600 hover:bg-gray-200">
            <FiClock size={24} />
        </button>
        );
    }

    return (
        <>
            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
                <button onClick={toggleExpand} className="p-1 rounded-full hover:bg-gray-200">
                    <FiX size={20} />
                </button>
                <button onClick={toggleTimer} className="p-1 rounded-full hover:bg-gray-200">
                    {isRunning ? <FiPause size={20} /> : <FiPlay size={20} />}
                </button>
                <span className="font-mono text-lg">{formatTime(time)}</span>
                <button onClick={resetTimer} className="p-1 rounded-full hover:bg-gray-200">
                    <FiRefreshCw size={20} />
                </button>
            </div>
        </>
    );
};

export default Timer