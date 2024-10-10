import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeMinWindow = `function minWindow(s, t) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerMinWindow = (fn: any) => {
	try {
		const testCases = [
			{ s: "ADOBECODEBANC", t: "ABC", expected: "BANC" },
			{ s: "a", t: "a", expected: "a" },
			{ s: "a", t: "aa", expected: "" },
		];

		for (const { s, t, expected } of testCases) {
			const result = fn(s, t);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Minimum Window Substring handler function error");
		throw new Error(error);
	}
};

const handlerMinWindowRun = (fn: any) => {
	try {
		const testCases = [
			{ s: "ADOBECODEBANC", t: "ABC", expected: "BANC" },
			{ s: "a", t: "a", expected: "a" },
			{ s: "a", t: "aa", expected: "" },
		];

		const testResults = [];

		for (const { s, t, expected } of testCases) {       
			const result = fn(s, t);
			try {
				assert.strictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify({ s, t }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify({ s, t }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from handlerMinWindowRun: ", error);
		throw new Error(error);
	}
};

export const minWindow: Problem = {
	id: "minimum-window-substring",
	title: "76. Minimum Window Substring",
	problemStatement: `<p class='mt-3'>
	Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return the minimum window substring of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window. If there is no such substring, return the empty string <code>""</code>.
	</p>
	<p class='mt-3'>
	Note that if there is such a substring, it is guaranteed that there will always be only one unique minimum window substring.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: 's = "ADOBECODEBANC", t = "ABC"',
			outputText: '"BANC"',
		},
		{
			id: 2,
			inputText: 's = "a", t = "a"',
			outputText: '"a"',
		},
		{
			id: 3,
			inputText: 's = "a", t = "aa"',
			outputText: '""',
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ s.length, t.length ≤ 10<sup>5</sup></code>
    </li> <li class='mt-2'>
        <code>s</code> and <code>t</code> consist of uppercase and lowercase English letters.
    </li>`,
	handlerFunction: handlerMinWindow,
	handlerRun: handlerMinWindowRun,
	starterCode: starterCodeMinWindow,
	order: 76,
	starterFunctionName: "function minWindow(",
};
