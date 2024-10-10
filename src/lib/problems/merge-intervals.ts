import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeMergeIntervals = `function merge(intervals) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerMergeIntervals = (fn: any) => {
	try {
		const testCases = [
			[[[1,3],[2,6],[8,10],[15,18]]],
			[[[1,4],[4,5]]],
			[[[1,4],[2,3]]],
		];

		const answers = [
			[[1,6],[8,10],[15,18]],
			[[1,5]],
			[[1,4]],
		];

		// loop all tests to check if the user's code is correct
		for (let i = 0; i < testCases.length; i++) {
			const result = fn(testCases[i][0]);
			assert.deepStrictEqual(result, answers[i]);
		}
		return true;
	} catch (error: any) {
		console.log("Merge Intervals handler function error");
		throw new Error(error);
	}
};

const mergeIntervalsRun = (fn: any) => {
	try {
		const testResults = [] as { case: number; passed: boolean; input: any; expectedOutput: string; actualOutput: string }[];
		const tests = [
			[[1,3],[2,6],[8,10],[15,18]],
			[[1,4],[4,5]],
			[[1,4],[2,3]],
		];
		const answers = [
			[[1,6],[8,10],[15,18]],
			[[1,5]],
			[[1,4]],
		];
		for (let i = 0; i < tests.length; i++) {
			const result = fn(tests[i]);
			try {
				assert.deepStrictEqual(result, answers[i]);

				// add test result
				testResults.push({
					case: i + 1,
					passed: JSON.stringify(result) === JSON.stringify(answers[i]),
					input: tests[i],
					expectedOutput: answers[i].toString(),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				console.error("Error from mergeIntervalsRun: ", error);
				// throw new Error(error);

				// add test result
				testResults.push({
					case: i + 1,
					passed: JSON.stringify(result) === JSON.stringify(answers[i]),
					input: tests[i],
					expectedOutput: answers[i].toString(),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.log("Error from mergeIntervalsRun: ", error);
		throw new Error(error);
	}
};

export const mergeIntervals: Problem = {
	id: "merge-intervals",
	title: "56. Merge Intervals",
	problemStatement: `<p class='mt-3'>
	Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
			outputText: "[[1,6],[8,10],[15,18]]",
			explanation: "Intervals [1,3] and [2,6] overlap, merging into [1,6].",
		},
		{
			id: 2,
			inputText: "intervals = [[1,4],[4,5]]",
			outputText: "[[1,5]]",
			explanation: "Intervals [1,4] and [4,5] are adjacent and should be merged into [1,5].",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ intervals.length ≤ 10<sup>4</sup></code>
        </li> <li class='mt-2'>
        <code>intervals[i].length == 2</code>
        </li> <li class='mt-2'>
        <code>0 ≤ start<sub>i</sub> ≤ end<sub>i</sub> ≤ 10<sup>4</sup></code>
        </li>`,
	handlerFunction: handlerMergeIntervals,
	starterCode: starterCodeMergeIntervals,
	handlerRun: mergeIntervalsRun,
	order: 56,
	starterFunctionName: "function merge(",
};
