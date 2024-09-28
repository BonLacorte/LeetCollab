import { problems } from '@/lib/problems'
import React, { useState } from 'react'
import { Problem } from '@/types/problems'

type TestCasesProps = {
    problem: Problem;
}


const TestCases = ({ problem }: TestCasesProps) => {

    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);

    return (
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
                            ${activeTestCaseId === index ? "text-white" : "text-gray-500"}
                        `}
                        >
                            Case {index + 1}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TestCases