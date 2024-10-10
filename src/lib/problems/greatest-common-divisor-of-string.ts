import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeGCDOfStrings = `function gcdOfStrings(str1, str2) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerGCDOfStrings = (fn: any) => {
	try {
		const testCases = [
			{ str1: "ABCABC", str2: "ABC", expected: "ABC" },
			{ str1: "ABABAB", str2: "ABAB", expected: "AB" },
			{ str1: "LEET", str2: "CODE", expected: "" },
		];

		for (const { str1, str2, expected } of testCases) {
			const result = fn(str1, str2);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Greatest Common Divisor of Strings handler function error");
		throw new Error(error);
	}
};

const handlerGCDOfStringsRun = (fn: any) => {
	try {
		const testCases = [
			{ str1: "ABCABC", str2: "ABC", expected: "ABC" },
			{ str1: "ABABAB", str2: "ABAB", expected: "AB" },
			{ str1: "LEET", str2: "CODE", expected: "" },
		];

		const testResults = [];

		for (const { str1, str2, expected } of testCases) {
			const result = fn(str1, str2);
			try {
				assert.strictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify({ str1, str2 }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({ 
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify({ str1, str2 }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from handlerGCDOfStringsRun: ", error);
		throw new Error(error);
	}
};



export const gcdOfStrings: Problem = {
	id: "greatest-common-divisor-of-strings",
	title: "1071. Greatest Common Divisor of Strings",
	problemStatement: `<p class='mt-3'>
	For two strings <code>s</code> and <code>t</code>, we say "<code>t</code> divides <code>s</code>" if and only if <code>s = t + ... + t</code> (i.e., <code>t</code> is concatenated with itself one or more times).
	</p>
	<p class='mt-3'>
	Given two strings <code>str1</code> and <code>str2</code>, return the largest string <code>t</code> that divides both <code>str1</code> and <code>str2</code>.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: 'str1 = "ABCABC", str2 = "ABC"',
			outputText: '"ABC"',
		},
		{
			id: 2,
			inputText: 'str1 = "ABABAB", str2 = "ABAB"',
			outputText: '"AB"',
		},
		{
			id: 3,
			inputText: 'str1 = "LEET", str2 = "CODE"',
			outputText: '""',
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ str1.length, str2.length ≤ 1000</code>
    </li> <li class='mt-2'>
        <code>str1</code> and <code>str2</code> consist of uppercase English letters.
    </li>`,
	handlerFunction: handlerGCDOfStrings,
	handlerRun: handlerGCDOfStringsRun,
	starterCode: starterCodeGCDOfStrings,
	order: 1071,
	starterFunctionName: "function gcdOfStrings(",
};
