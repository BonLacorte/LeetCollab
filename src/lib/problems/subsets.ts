import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeSubsets = `function subsets(nums) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerSubsets = (fn: any) => {
	try {
		const testCases = [
			{ nums: [1, 2, 3], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] },
			{ nums: [0], expected: [[], [0]] },
		];

		for (const { nums, expected } of testCases) {
			const result = fn(nums);
			assert.deepStrictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Subsets handler function error");
		throw new Error(error);
	}
};

const handlerSubsetsRun = (fn: any) => {
	try {
		const testCases = [
			{ nums: [1, 2, 3], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] },
			{ nums: [0], expected: [[], [0]] },
		];

		const testResults = [];

		for (const { nums, expected } of testCases) {
			const result = fn(nums);
			try {
				assert.deepStrictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
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
		console.error("Error from handlerSubsetsRun: ", error);
		throw new Error(error);
	}
};


export const subsets: Problem = {
	id: "subsets",
	title: "78. Subsets",
	problemStatement: `<p class='mt-3'>
	Given an integer array <code>nums</code> of unique elements, return <em>all possible subsets (the power set)</em>.
	</p>
	<p class='mt-3'>
	The solution set must not contain duplicate subsets. Return the solution in any order.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: "nums = [1,2,3]",
			outputText: "[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]",
		},
		{
			id: 2,
			inputText: "nums = [0]",
			outputText: "[[],[0]]",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ nums.length ≤ 10</code>
        </li> <li class='mt-2'>
        <code>-10 ≤ nums[i] ≤ 10</code>
        </li> <li class='mt-2'>
        All the numbers of <code>nums</code> are unique.
    </li>`,
	handlerFunction: handlerSubsets,
	handlerRun: handlerSubsetsRun,
	starterCode: starterCodeSubsets,
	order: 78,
	starterFunctionName: "function subsets(",
};
