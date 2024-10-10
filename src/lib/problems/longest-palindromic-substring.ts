import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeLongestPalindromicSubstring = `function longestPalindrome(s) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerLongestPalindromicSubstring = (fn: any) => {
	try {
		const testCases = [
			{ s: "babad", expected: "bab" },
			{ s: "cbbd", expected: "bb" },
			{ s: "a", expected: "a" },
			{ s: "ac", expected: "a" },
		];

		for (const { s, expected } of testCases) {
			const result = fn(s);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Longest Palindromic Substring handler function error");
		throw new Error(error);
	}
};

const handlerLongestPalindromicSubstringRun = (fn: any) => {
	try {
		const testResults = [] as { case: number; passed: boolean; input: any; expectedOutput: string; actualOutput: string }[];
		const tests = [
			{ s: "babad", expected: "bab" },
			{ s: "cbbd", expected: "bb" },
			{ s: "a", expected: "a" },
			{ s: "ac", expected: "a" },
		];

		for (const { s, expected } of tests) {
			const result = fn(s);
			try {
				assert.strictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: JSON.stringify(result) === JSON.stringify(expected),
					input: s,
					expectedOutput: expected.toString(),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: s,
					expectedOutput: expected.toString(),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.log("Longest Palindromic Substring handler function error");
		throw new Error(error);
	}
};

export const longestPalindromicSubstring: Problem = {
	id: "longest-palindromic-substring",
	title: "5. Longest Palindromic Substring",
	problemStatement: `<p class='mt-3'>
	Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>.
	</p>
	<p class='mt-3'>
	A palindrome is a string that reads the same forward and backward.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: 's = "babad"',
			outputText: '"bab"',
			explanation: "Note that 'aba' is also a valid answer.",
		},
		{
			id: 2,
			inputText: 's = "cbbd"',
			outputText: '"bb"',
		},
		{
			id: 3,
			inputText: 's = "a"',
			outputText: '"a"',
		},
		{
			id: 4,
			inputText: 's = "ac"',
			outputText: '"a"',
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ s.length ≤ 1000</code>
        </li> <li class='mt-2'>
        <code>s</code> consist of only digits and English letters.
        </li>`,
	handlerFunction: handlerLongestPalindromicSubstring,
	handlerRun: handlerLongestPalindromicSubstringRun,
	starterCode: starterCodeLongestPalindromicSubstring,
	order: 5,
	starterFunctionName: "function longestPalindrome(",
};
