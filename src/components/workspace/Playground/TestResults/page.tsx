import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { TestCase } from '@/types/problems';



type TestResultProps = {
    results: TestCase[] | null;
    runtime: number | null;
}

const TestResults = ({ results, runtime }: TestResultProps) => {
    if (!results) {
        return <h3 className="text-lg text-gray-900 font-semibold mb-2">No test results available. Click "Run" to test your code.</h3>
    }

    const allPassed = results.every(result => result.passed);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold flex items-center">
                    {allPassed ? (
                        <span className="text-green-500 flex items-center">
                            <CheckCircle className="mr-2" /> Accepted
                        </span>
                    ) : (
                        <span className="text-red-500 flex items-center">
                            <XCircle className="mr-2" /> Wrong Answer
                        </span>
                    )}
                </h2>
                {/* {runtime !== null && <p>Runtime: {runtime} ms</p>} */}
            </div>
            <div>
                <h3 className="text-lg text-gray-900 font-semibold mb-2">Test Cases:</h3>
                {results.map((testCase, index) => (
                    <div key={index} className="mb-4 p-2 border rounded text-gray-900">
                        <h4 className="font-medium">Case {testCase.case}:</h4>
                        <p><strong>Input:</strong> {testCase.input}</p>
                        <p><strong>Expected Output:</strong> {testCase.expectedOutput}</p>
                        <p><strong>Actual Output:</strong> {testCase.actualOutput}</p>
                        <p className={testCase.passed ? "text-green-500" : "text-red-500"}>
                            {testCase.passed ? "Passed" : "Failed"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TestResults