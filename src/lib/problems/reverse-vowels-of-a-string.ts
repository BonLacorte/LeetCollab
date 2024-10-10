import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeReverseVowels = `function reverseVowels(s) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerReverseVowels = (fn: any) => {
	try {
		const testCases = [
			{ s: "hello", expected: "holle" },
			{ s: "leetcode", expected: "leotcede" },
			{ s: "aA", expected: "Aa" },
		];

		for (const { s, expected } of testCases) {
			const result = fn(s);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Reverse Vowels of a String handler function error");
		throw new Error(error);
	}
};

const handlerReverseVowelsRun = (fn: any) => {
	try {
		const testCases = [
			{ s: "hello", expected: "holle" },
			{ s: "leetcode", expected: "leotcede" },
			{ s: "aA", expected: "Aa" },
		];

		const testResults = [];

		for (const { s, expected } of testCases) {
			const result = fn(s);
			try {
				assert.strictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify({ s }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify({ s }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from handlerReverseVowelsRun: ", error);
		throw new Error(error);
	}
};



export const reverseVowels: Problem = {
	id: "reverse-vowels-of-a-string",
	title: "345. Reverse Vowels of a String",
	problemStatement: `<p class='mt-3'>
	Given a string <code>s</code>, reverse only all the vowels in the string and return it.
	</p>
	<p class='mt-3'>
	The vowels are <code>'a'</code>, <code>'e'</code>, <code>'i'</code>, <code>'o'</code>, and <code>'u'</code>, and they can appear in both lower and upper cases.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: 's = "hello"',
			outputText: '"holle"',
		},
		{
			id: 2,
			inputText: 's = "leetcode"',
			outputText: '"leotcede"',
		},
		{
			id: 3,
			inputText: 's = "aA"',
			outputText: '"Aa"',
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ s.length ≤ 3 * 10^5</code>
    </li> <li class='mt-2'>
        <code>s</code> consists of printable ASCII characters.
    </li>`,
	handlerFunction: handlerReverseVowels,
	handlerRun: handlerReverseVowelsRun,
	starterCode: starterCodeReverseVowels,
	order: 345,
	starterFunctionName: "function reverseVowels(",
};
