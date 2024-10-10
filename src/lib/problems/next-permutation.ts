import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeNextPermutation = `function nextPermutation(nums) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerNextPermutation = (fn: any) => {
	try {
		const testCases = [
			{ nums: [1, 2, 3], expected: [1, 3, 2] },
			{ nums: [3, 2, 1], expected: [1, 2, 3] },
			{ nums: [1, 1, 5], expected: [1, 5, 1] },
			{ nums: [1], expected: [1] },
		];

		for (const { nums, expected } of testCases) {
			const result = fn([...nums]);
			assert.deepStrictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Next Permutation handler function error");
		throw new Error(error);
	}
};

const handlerNextPermutationRun = (fn: any) => {
	try {
		const testCases = [
			{ nums: [1, 2, 3], expected: [1, 3, 2] },
			{ nums: [3, 2, 1], expected: [1, 2, 3] },
			{ nums: [1, 1, 5], expected: [1, 5, 1] },
			{ nums: [1], expected: [1] },
		];

		const testResults = [];

		for (const { nums, expected } of testCases) {
			const result = fn([...nums]);
			try {
				assert.deepStrictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: JSON.stringify(result) === JSON.stringify(expected),
					input: JSON.stringify(nums),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify(nums),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from nextPermutationRun: ", error);
		throw new Error(error);
	}
};



export const nextPermutation: Problem = {
	id: "next-permutation",
	title: "31. Next Permutation",
	problemStatement: `<p class='mt-3'>
	Given an array of integers <code>nums</code>, find the next permutation of <em>nums</em>.
	</p>
	<p class='mt-3'>
	The replacement must be in-place and use only constant extra memory.
	</p>
	<p class='mt-3'>
	If no next permutation is possible, return the lowest possible order (sorted in ascending order).
	</p>`,
	examples: [
		{
			id: 1,
			inputText: "nums = [1,2,3]",
			outputText: "[1,3,2]",
		},
		{
			id: 2,
			inputText: "nums = [3,2,1]",
			outputText: "[1,2,3]",
		},
		{
			id: 3,
			inputText: "nums = [1,1,5]",
			outputText: "[1,5,1]",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ nums.length ≤ 100</code>
        </li> <li class='mt-2'>
        <code>0 ≤ nums[i] ≤ 100</code>
        </li>`,
	handlerFunction: handlerNextPermutation,
	handlerRun: handlerNextPermutationRun,
	starterCode: starterCodeNextPermutation,
	order: 31,
	starterFunctionName: "function nextPermutation(",
};
