import { Problem } from '@/types/problems';
import React from 'react';

type Submission = {
    submissionId: string;
    problemId: string;
    problem: Problem;
    userId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    status: string;
}

const SubmissionsActivityChart: React.FC<{ submissions: Submission[] }> = ({ submissions }) => {
    // Get the current date and the date one year ago
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    // Create an array of dates for the last year
    const dates = Array.from({ length: 365 }, (_, i) => {
        const date = new Date(oneYearAgo);
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
    });

    // Count submissions for each date
    const submissionCounts = dates.reduce((acc, date) => {
        acc[date] = submissions.filter(s => {
            const submissionDate = new Date(s.createdAt);
            return submissionDate.toISOString().split('T')[0] === date;
        }).length;
        return acc;
    }, {} as Record<string, number>);

    const maxSubmissions = Math.max(...Object.values(submissionCounts));

    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    const getColor = (count: number) => {
        if (count === 0) return 'bg-gray-100';
        if (count < maxSubmissions / 3) return 'bg-green-300';
        if (count < (2 * maxSubmissions) / 3) return 'bg-green-500';
        return 'bg-green-700';
    };

    return (
        <div className="w-full max-w-3xl">
            <div className="flex justify-between mb-2">
                {months.map(month => (
                    <div key={month} className="text-xs text-gray-500">{month}</div>
                ))}
            </div>
            <div className="grid grid-cols-53 gap-[2px]">
                {dates.map((date, index) => (
                    <div
                        key={date}
                        className={`w-3 h-3 ${getColor(submissionCounts[date] || 0)} ${index % 7 === 0 ? 'mt-[2px]' : ''}`}
                        title={`${date}: ${submissionCounts[date] || 0} submissions`}
                    />
                ))}
            </div>
            <div className="mt-2 text-sm text-gray-600">
                {submissions.length} submissions in the past year
            </div>
        </div>
    );
};

export default SubmissionsActivityChart;