import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeKidsWithCandies = `function kidsWithCandies(candies, extraCandies) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerKidsWithCandies = (fn: any) => {
	try {
		const testCases = [
			{ candies: [2, 3, 5, 1, 3], extraCandies: 3, expected: [true, true, true, false, true] },
			{ candies: [4, 2, 1, 1, 2], extraCandies: 1, expected: [true, false, false, false, false] },
			{ candies: [12, 1, 12], extraCandies: 10, expected: [true, false, true] },
		];

		for (const { candies, extraCandies, expected } of testCases) {
			const result = fn(candies, extraCandies);
			assert.deepStrictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Kids With the Greatest Number of Candies handler function error");
		throw new Error(error);
	}
};

const handlerKidsWithCandiesRun = (fn: any) => {
	try {
		const testCases = [
			{ candies: [2, 3, 5, 1, 3], extraCandies: 3, expected: [true, true, true, false, true] },
			{ candies: [4, 2, 1, 1, 2], extraCandies: 1, expected: [true, false, false, false, false] },
			{ candies: [12, 1, 12], extraCandies: 10, expected: [true, false, true] },
		];

		const testResults = [];

		for (const { candies, extraCandies, expected } of testCases) {
			const result = fn(candies, extraCandies);
			try {
				assert.deepStrictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify({ candies, extraCandies }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify({ candies, extraCandies }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from handlerKidsWithCandiesRun: ", error);
		throw new Error(error);
	}
};


export const kidsWithCandies: Problem = {
	id: "kids-with-the-greatest-number-of-candies",
	title: "1431. Kids With the Greatest Number of Candies",
	problemStatement: `<p class='mt-3'>
	There are <code>n</code> kids with candies. You are given an integer array <code>candies</code>, where each <code>candies[i]</code> represents the number of candies the <code>i<sup>th</sup></code> kid has, and an integer <code>extraCandies</code>, denoting the number of extra candies that you have.
	</p>
	<p class='mt-3'>
	Return <em>a boolean array <code>result</code> of length <code>n</code>, where <code>result[i]</code> is <code>true</code> if, after giving the <code>i<sup>th</sup></code> kid all the <code>extraCandies</code>, they will have the <strong>greatest</strong> number of candies among all the kids, or <code>false</code> otherwise.</em>
	</p>`,
	examples: [
		{
			id: 1,
			inputText: "candies = [2,3,5,1,3], extraCandies = 3",
			outputText: "[true, true, true, false, true]",
		},
		{
			id: 2,
			inputText: "candies = [4,2,1,1,2], extraCandies = 1",
			outputText: "[true, false, false, false, false]",
		},
		{
			id: 3,
			inputText: "candies = [12,1,12], extraCandies = 10",
			outputText: "[true, false, true]",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>2 ≤ candies.length ≤ 100</code>
    </li> <li class='mt-2'>
        <code>1 ≤ candies[i] ≤ 100</code>
    </li> <li class='mt-2'>
        <code>1 ≤ extraCandies ≤ 50</code>
    </li>`,
	handlerFunction: handlerKidsWithCandies,
	handlerRun: handlerKidsWithCandiesRun,
	starterCode: starterCodeKidsWithCandies,
	order: 1431,
	starterFunctionName: "function kidsWithCandies(",
};
