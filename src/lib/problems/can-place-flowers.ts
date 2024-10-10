import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeCanPlaceFlowers = `function canPlaceFlowers(flowerbed, n) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerCanPlaceFlowers = (fn: any) => {
	try {
		const testCases = [
			{ flowerbed: [1, 0, 0, 0, 1], n: 1, expected: true },
			{ flowerbed: [1, 0, 0, 0, 1], n: 2, expected: false },
			{ flowerbed: [0, 0, 1, 0, 0], n: 1, expected: true },
		];

		for (const { flowerbed, n, expected } of testCases) {
			const result = fn(flowerbed, n);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Can Place Flowers handler function error");
		throw new Error(error);
	}
};

const handlerCanPlaceFlowersRun = (fn: any) => {
	try {
		const testCases = [
			{ flowerbed: [1, 0, 0, 0, 1], n: 1, expected: true },
			{ flowerbed: [1, 0, 0, 0, 1], n: 2, expected: false },
			{ flowerbed: [0, 0, 1, 0, 0], n: 1, expected: true },
		];

		const testResults = [];

		for (const { flowerbed, n, expected } of testCases) {
			const result = fn(flowerbed, n);
			try {
				assert.strictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify({ flowerbed, n }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify({ flowerbed, n }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from handlerCanPlaceFlowersRun: ", error);
		throw new Error(error);
	}
};


export const canPlaceFlowers: Problem = {
	id: "can-place-flowers",
	title: "605. Can Place Flowers",
	problemStatement: `<p class='mt-3'>
	You have a long flowerbed in which some of the plots are planted, and some are not. However, flowers cannot be planted in adjacent plots.
	</p>
	<p class='mt-3'>
	Given an integer array <code>flowerbed</code> containing <code>0</code>'s and <code>1</code>'s, where <code>0</code> means empty and <code>1</code> means not empty, and an integer <code>n</code>, return <em><strong>true</strong> if <code>n</code> new flowers can be planted in the flowerbed without violating the no-adjacent-flowers rule.</em>
	</p>`,
	examples: [
		{
			id: 1,
			inputText: "flowerbed = [1,0,0,0,1], n = 1",
			outputText: "true",
		},
		{
			id: 2,
			inputText: "flowerbed = [1,0,0,0,1], n = 2",
			outputText: "false",
		},
		{
			id: 3,
			inputText: "flowerbed = [0,0,1,0,0], n = 1",
			outputText: "true",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ flowerbed.length ≤ 2 * 10^4</code>
    </li> <li class='mt-2'>
        <code>flowerbed[i]</code> is <code>0</code> or <code>1</code>.
    </li> <li class='mt-2'>
        There are no two adjacent flowers in <code>flowerbed</code>.
    </li>`,
	handlerFunction: handlerCanPlaceFlowers,
	handlerRun: handlerCanPlaceFlowersRun,
	starterCode: starterCodeCanPlaceFlowers,
	order: 605,
	starterFunctionName: "function canPlaceFlowers(",
};
