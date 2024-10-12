import React from 'react';

const Languages = () => {
    const languages = [
        { name: 'JavaScript', problemsSolved: 23 },
        // { name: 'Python3', problemsSolved: 8 },
        // { name: 'C++', problemsSolved: 4 },
    ];

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Languages</h2>
            <div className="space-y-2">
                {languages.map((lang) => (
                    <div key={lang.name} className="flex justify-between">
                        <span>{lang.name}</span>
                        <span>{lang.problemsSolved} problems solved</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Languages;