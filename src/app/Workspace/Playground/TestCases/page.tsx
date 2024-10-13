'use client'
import { problems } from '@/lib/problems'
import React, { useState } from 'react'
import { Problem } from '@/types/problems'
import { ScrollArea } from '@/components/ui/scroll-area';

type TestCase = {
    nums: number[];
    target: number;
};

type TestCasesProps = {
    problem: Problem;
}

const TestCases = ({ problem }: TestCasesProps) => {

    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);

    return (
        <ScrollArea className='h-full'>
            {/* <div className="flex items-center mb-4">
        <div className="text-green-500 mr-2">✓</div>
                <h2 className="text-lg font-semibold">Testcase</h2>
            </div> */}
            <div className='flex w-full justify-start'>
                {problem.examples.map((example, index) => (
                    <div
                        className=''
                        key={example.id}
                        onClick={() => setActiveTestCaseId(index)}
                    >
                        <div className='flex flex-wrap items-center gap-y-4'>
                            <div
                                className={`flex items-center relative text-sm font-medium rounded-2xl px-4 py-2 cursor-pointer whitespace-nowrap
                                ${activeTestCaseId === index ? "text-gray-900 bg-gray-200" : "text-gray-500"}
                            `}
                            >
                                Case {index + 1}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
            
            <div className='font-semibold'>
                <p className='text-lg font-medium mt-4 text-gray-900'>Input:</p>
                <div className='w-full text-lg font-medium cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent mt-2 text-gray-900'>
                    {problem.examples[activeTestCaseId].inputText}
                </div>
                <p className='text-lg font-medium mt-4 text-gray-900'>Output:</p>
                <div className='w-full text-lg font-medium cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent mt-2 text-gray-900'>
                    {problem.examples[activeTestCaseId].outputText}
                </div>
            </div>
        </ScrollArea>
    )
}

export default TestCases