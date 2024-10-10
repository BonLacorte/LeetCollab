import assert from "assert";
import { Problem } from "@/types/problems";
import example1 from "./images/water-bottles-1.png";
import example2 from "./images/water-bottles-2.png";

const starterCodeWaterBottles = `function numWaterBottles(numBottles, numExchange) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerWaterBottles = (fn: any) => {
	try {
		const testCases = [
			{ numBottles: 9, numExchange: 3, expected: 13 },
			{ numBottles: 15, numExchange: 4, expected: 19 },
			{ numBottles: 5, numExchange: 5, expected: 6 },
			{ numBottles: 2, numExchange: 3, expected: 2 },
		];

		for (const { numBottles, numExchange, expected } of testCases) {
			const result = fn(numBottles, numExchange);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Water Bottles handler function error");
		throw new Error(error);
	}
};

const waterBottlesRun = (fn: any) => {
	try {
		const testResults = [] as { case: number; passed: boolean; input: any; expectedOutput: string; actualOutput: string }[];
		const tests = [
			{ numBottles: 9, numExchange: 3, expected: 13 },
			{ numBottles: 15, numExchange: 4, expected: 19 },
			{ numBottles: 5, numExchange: 5, expected: 6 },
			{ numBottles: 2, numExchange: 3, expected: 2 },
		];

		for (const { numBottles, numExchange, expected } of tests) {
			const result = fn(numBottles, numExchange);
			try {
				assert.strictEqual(result, expected);

				// add test result
				testResults.push({
					case: testResults.length + 1,
					passed: JSON.stringify(result) === JSON.stringify(expected),
					input: `numBottles: ${numBottles}, numExchange: ${numExchange}`,
					expectedOutput: expected.toString(),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				console.error("Error from waterBottlesRun: ", error);
				// throw new Error(error);

				// add test result
				testResults.push({
					case: testResults.length + 1,
					passed: JSON.stringify(result) === JSON.stringify(expected),
					input: `numBottles: ${numBottles}, numExchange: ${numExchange}`,
					expectedOutput: expected.toString(),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.log("Error from waterBottlesRun: ", error);
		throw new Error(error);
	}
};

export const waterBottles: Problem = {
	id: "water-bottles",
	title: "1518. Water Bottles",
	problemStatement: `<p class='mt-3'>
	You have <code>numBottles</code> water bottles, and you can exchange <code>numExchange</code> empty water bottles for one full water bottle.
	</p>
	<p class='mt-3'>The operation continues until you cannot exchange any more empty bottles.</p>
	<p class='mt-3'>Return the <em>maximum number of water bottles</em> you can drink.</p>`,
	examples: [
		{
			id: 1,
			inputText: "numBottles = 9, numExchange = 3",
			outputText: "13",
			explanation: "You can drink 9 bottles, exchange 9 empty bottles for 3 full ones, and drink 3 more. Then, exchange 3 empty bottles for 1 full one, making a total of 13.",
			img: example1.src,
		},
		{
			id: 2,
			inputText: "numBottles = 15, numExchange = 4",
			outputText: "19",
			img: example2.src,
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ numBottles ≤ 100</code>
        </li> <li class='mt-2'>
        <code>2 ≤ numExchange ≤ 100</code>
        </li>`,
	handlerFunction: handlerWaterBottles,
	handlerRun: waterBottlesRun,
	starterCode: starterCodeWaterBottles,
	order: 1518,
	starterFunctionName: "function numWaterBottles(",
};
