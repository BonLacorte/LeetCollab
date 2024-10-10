import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeLongestValidParentheses = `function longestValidParentheses(s) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerLongestValidParentheses = (fn: any) => {
	try {
		const testCases = [
			{ s: "(()", expected: 2 },
			{ s: ")()())", expected: 4 },
			{ s: "", expected: 0 },
		];

		for (const { s, expected } of testCases) {
			const result = fn(s);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Longest Valid Parentheses handler function error");
		throw new Error(error);
	}
};

const handlerLongestValidParenthesesRun = (fn: any) => {
	try {
		const testCases = [
			{ s: "(()", expected: 2 },
			{ s: ")()())", expected: 4 },
			{ s: "", expected: 0 },
		];

		const testResults = [];

		for (const { s, expected } of testCases) {
			const result = fn(s);
			try {
				assert.strictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify(s),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify(s),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from handlerLongestValidParenthesesRun: ", error);
		throw new Error(error);
	}
};


export const longestValidParentheses: Problem = {
	id: "longest-valid-parentheses",
	title: "32. Longest Valid Parentheses",
	problemStatement: `<p class='mt-3'>
	Given a string containing just the characters <code>'('</code> and <code>')'</code>, find the length of the longest valid (well-formed) parentheses substring.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: 's = "(()"',
			outputText: "2",
		},
		{
			id: 2,
			inputText: 's = ")()())"',
			outputText: "4",
		},
		{
			id: 3,
			inputText: 's = ""',
			outputText: "0",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>0 ≤ s.length ≤ 3 * 10<sup>4</sup></code>
    </li> <li class='mt-2'>
        <code>s</code> consists of just <code>'('</code> and <code>')'</code> characters.
    </li>`,
	handlerFunction: handlerLongestValidParentheses,
	handlerRun: handlerLongestValidParenthesesRun,
	starterCode: starterCodeLongestValidParentheses,
	order: 32,
	starterFunctionName: "function longestValidParentheses(",
};
