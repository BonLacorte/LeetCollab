import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Props = {
    solvedProblems: any[];
}

const Skills = ({ solvedProblems }: Props) => {
    const [showAllSkills, setShowAllSkills] = useState(false);

    // get the array of problem on each solved problems
    const problemCategories = solvedProblems && Array.isArray(solvedProblems)
    ? solvedProblems.map((solvedProblem: any) => solvedProblem.problem.category)
    : [];

    console.log("problemCategories: ", problemCategories);

    const skillCategories = [
        { name: 'Advanced', skills: ['Dynamic Programming', 'Divide and Conquer', 'Trie', 'Graph Algorithms'] },
        { name: 'Intermediate', skills: ['Hash Table', 'Math', 'Greedy', 'Recursion', 'Binary Search'] },
        { name: 'Fundamental', skills: ['Array', 'String', 'Two Pointers', 'Sorting', 'Linked List', 'Stack', 'Queue', 'Tree', 'Sliding Window'] },
    ];
    
    const skills = skillCategories.map(category => ({
        category: category.name,
        items: category.skills.map(skill => ({
            name: skill,
            count: problemCategories.filter(cat => cat === skill).length
        }))
        .filter(skill => skill.count > 0) // Only include skills with a count greater than 0
})).filter(category => category.items.length > 0); // Only include categories that have at least one skill

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Skills</h2>
            <div className="space-y-4">
                {skills.map((category) => (
                    <div key={category.category}>
                        <h3 className="font-medium text-gray-600">{category.category}</h3>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {category.items.slice(0, showAllSkills ? undefined : 3).map((skill) => (
                                <div key={skill.name} className="flex items-center">
                                    <span className="text-sm p-2 border border-gray-300 rounded-2xl">{skill.name}</span>
                                    <span className="ml-1 text-xs text-gray-600">x{skill.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button 
                className="text-blue-500 mt-2 flex items-center"
                onClick={() => setShowAllSkills(!showAllSkills)}
            >
                {showAllSkills ? 'Show less' : 'Show more'}
                {showAllSkills ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
        </div>
    );
};

export default Skills;