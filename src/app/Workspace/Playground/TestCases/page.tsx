import { problems } from '@/lib/problems'
import React, { useState } from 'react'
import { Problem } from '@/types/problems'

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
        <>
            {/* <div className="flex items-center mb-4">
        <div className="text-green-500 mr-2">✓</div>
                <h2 className="text-lg font-semibold">Testcase</h2>
            </div> */}
            <div className='flex'>
                {problem.examples.map((example, index) => (
                    <div
                        className='mr-2 items-start mt-2 '
                        key={example.id}
                        onClick={() => setActiveTestCaseId(index)}
                    >
                        <div className='flex flex-wrap items-center gap-y-4'>
                            <div
                                className={`font-medium items-center  relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                                ${activeTestCaseId === index ? "text-black" : "text-gray-500"}
                            `}
                            >
                                Case {index + 1}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
            
            <div className='font-semibold'>
                <p className='text-sm font-medium mt-4'>Input:</p>
                <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent mt-2'>
                    {problem.examples[activeTestCaseId].inputText}
                </div>
                <p className='text-sm font-medium mt-4'>Output:</p>
                <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent mt-2'>
                    {problem.examples[activeTestCaseId].outputText}
                </div>
            </div>
        </>
    )
}

export default TestCases