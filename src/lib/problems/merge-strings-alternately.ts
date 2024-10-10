import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeMergeAlternately = `function mergeAlternately(word1, word2) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerMergeAlternately = (fn: any) => {
	try {
		const testCases = [
			{ word1: "abc", word2: "pqr", expected: "apbqcr" },
			{ word1: "ab", word2: "pqrs", expected: "apbqrs" },
			{ word1: "abcd", word2: "pq", expected: "apbqcd" },
		];

		for (const { word1, word2, expected } of testCases) {
			const result = fn(word1, word2);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Merge String Alternately handler function error");
		throw new Error(error);
	}
};

const handlerMergeAlternatelyRun = (fn: any) => {
    try {
        const testCases = [
            { word1: "abc", word2: "pqr", expected: "apbqcr" },
            { word1: "ab", word2: "pqrs", expected: "apbqrs" },
            { word1: "abcd", word2: "pq", expected: "apbqcd" },
        ];

        const testResults = [];

        for (const { word1, word2, expected } of testCases) {
            const result = fn(word1, word2);
            try {
                assert.strictEqual(result, expected);
                testResults.push({
                    case: testResults.length + 1,
                    passed: true,
                    input: JSON.stringify({ word1, word2 }),
                    expectedOutput: JSON.stringify(expected),
                    actualOutput: JSON.stringify(result)
                });
            } catch (error: any) {
                testResults.push({
                    case: testResults.length + 1,
                    passed: false,
                    input: JSON.stringify({ word1, word2 }),
                    expectedOutput: JSON.stringify(expected),
                    actualOutput: JSON.stringify(result)
                });
            }
        }
        return testResults;
    } catch (error: any) {
        console.error("Error from handlerMergeAlternatelyRun: ", error);
        throw new Error(error);
    }
};

export const mergeAlternately: Problem = {
	id: "merge-strings-alternately",
	title: "1768. Merge Strings Alternately",
	problemStatement: `<p class='mt-3'>
	You are given two strings <code>word1</code> and <code>word2</code>. Merge the strings by adding letters in alternating order, starting with <code>word1</code>.
	</p>
	<p class='mt-3'>
	If a string is longer than the other, append the additional letters onto the end of the merged string.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: 'word1 = "abc", word2 = "pqr"',
			outputText: '"apbqcr"',
		},
		{
			id: 2,
			inputText: 'word1 = "ab", word2 = "pqrs"',
			outputText: '"apbqrs"',
		},
		{
			id: 3,
			inputText: 'word1 = "abcd", word2 = "pq"',
			outputText: '"apbqcd"',
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ word1.length, word2.length ≤ 100</code>
    </li> <li class='mt-2'>
        <code>word1</code> and <code>word2</code> consist of lowercase English letters.
    </li>`,
	handlerFunction: handlerMergeAlternately,
	handlerRun: handlerMergeAlternatelyRun,
	starterCode: starterCodeMergeAlternately,
	order: 1768,
	starterFunctionName: "function mergeAlternately(",
};
