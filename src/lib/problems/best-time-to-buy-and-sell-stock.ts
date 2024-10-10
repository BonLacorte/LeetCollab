import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeMaxProfit = `function maxProfit(prices) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerMaxProfit = (fn: any) => {
	try {
        const prices = [
            [7, 1, 5, 3, 6, 4], 
            [7, 6, 4, 3, 1]
        ];

        const expected = [5, 0];

		// loop all tests to check if the user's code is correct
		for (let i = 0; i < prices.length; i++) {
			const result = fn(prices[i]);
			assert.strictEqual(result, expected[i]);
            console.log("Hello");
		}
		return true;
	} catch (error: any) {
		console.log("Best Time to Buy and Sell Stock handler function error");
		throw new Error(error);
	}
};

const maxProfitRun = (fn: any) => {
	try {
		const testResults = [] as { case: number; passed: boolean; input: any; expectedOutput: string; actualOutput: string }[];
		const tests = [
			[7, 1, 5, 3, 6, 4], 
			[7, 6, 4, 3, 1]
		];
		const answers = [5, 0];
		for (let i = 0; i < tests.length; i++) {
			const result = fn(tests[i]);
			try {
				assert.strictEqual(result, answers[i]);

				// add test result
				testResults.push({
					case: i + 1,
					passed: JSON.stringify(result) === JSON.stringify(answers[i]),
					input: "prices: " + tests[i],
					expectedOutput: answers[i].toString(),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				console.error("Error from maxProfitRun: ", error);
				// throw new Error(error);

				// add test result
				testResults.push({
					case: i + 1,
					passed: JSON.stringify(result) === JSON.stringify(answers[i]),
					input: "prices: " + tests[i],
					expectedOutput: answers[i].toString(),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.log("Error from maxProfitRun: ", error);
		throw new Error(error);
	}
};

export const bestTimeToBuyAndSellStock: Problem = {
	id: "best-time-to-buy-and-sell-stock",
	title: "121. Best Time to Buy and Sell Stock",
	problemStatement: `<p class='mt-3'>
	You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.
	</p>
	<p class='mt-3'>You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.</p>
	<p class='mt-3'>Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return <code>0</code>.</p>`,
	examples: [
		{
			id: 1,
			inputText: "prices = [7,1,5,3,6,4]",
			outputText: "5",
			explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
		},
		{
			id: 2,
			inputText: "prices = [7,6,4,3,1]",
			outputText: "0",
			explanation: "In this case, no transactions are done and the maximum profit is 0.",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>1 ≤ prices.length ≤ 10<sup>5</sup></code>
    </li> <li class='mt-2'>
        <code>0 ≤ prices[i] ≤ 10<sup>4</sup></code>
    </li>`,
	handlerFunction: handlerMaxProfit,
	handlerRun: maxProfitRun,
	starterCode: starterCodeMaxProfit,
	order: 121,
	starterFunctionName: "function maxProfit(",
};
