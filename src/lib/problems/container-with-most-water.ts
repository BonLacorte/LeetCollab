import assert from "assert";
import { Problem } from "@/types/problems";
import example1 from "./images/container-with-most-water-1.jpg";

const starterCodeContainerWithMostWater = `function maxArea(height) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerContainerWithMostWater = (fn: any) => {
	try {
		const heights = [
			[1,8,6,2,5,4,8,3,7],
			[1,1],
			[4,3,2,1,4],
			[1,2,1]
		];

		const answers = [49, 1, 16, 2];

		// loop all tests to check if the user's code is correct
		for (let i = 0; i < heights.length; i++) {
			// result is the output of the user's function and answer is the expected output
			const result = fn(heights[i]);
			assert.strictEqual(result, answers[i]);
		}
		return true;
	} catch (error: any) {
		console.log("Container With Most Water handler function error");
		throw new Error(error);
	}
};

const containerWithMostWaterRun = (fn: any) => {
	try {
		const testResults = [] as { case: number; passed: boolean; input: any; expectedOutput: string; actualOutput: string }[];
		const tests = [
			[1,8,6,2,5,4,8,3,7],
			[1,1],
			[4,3,2,1,4],
			[1,2,1]
		];
		const answers = [49, 1, 16, 2];
		for (let i = 0; i < tests.length; i++) {
			const result = fn(tests[i]);
			try {
				assert.strictEqual(result, answers[i]);

				// add test result
				testResults.push({
					case: i + 1,
					passed: JSON.stringify(result) === JSON.stringify(answers[i]),
					input: "height: " + tests[i],
					expectedOutput: answers[i].toString(),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				console.error("Error from containerWithMostWaterRun: ", error);
				// throw new Error(error);

				// add test result
				testResults.push({
					case: i + 1,
					passed: JSON.stringify(result) === JSON.stringify(answers[i]),
					input: "height: " + tests[i],
					expectedOutput: answers[i].toString(),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.log("Error from containerWithMostWaterRun: ", error);
		throw new Error(error);
	}
};


export const containerWithMostWater: Problem = {
	id: "container-with-most-water",
	title: "11. Container With Most Water",
	problemStatement: `<p class='mt-3'>
	You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.
	</p>
	<p class='mt-3'>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>
	<p class='mt-3'>Return the maximum amount of water a container can store.</p>
	<p class='mt-3'>You may not slant the container.</p>`,
	examples: [
		{
			id: 1,
			inputText: "height = [1,8,6,2,5,4,8,3,7]",
			outputText: "49",
			explanation: "The vertical lines drawn at indices 1 and 8 form a container with 49 units of water.",
			img: example1.src,
		},
		{
			id: 2,
			inputText: "height = [1,1]",
			outputText: "1",
		},
		{
			id: 3,
			inputText: "height = [4,3,2,1,4]",
			outputText: "16",
		},
		{
			id: 4,
			inputText: "height = [1,2,1]",
			outputText: "2",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>n == height.length</code>
        </li> <li class='mt-2'>
        <code>2 ≤ n ≤ 10<sup>5</sup></code>
        </li> <li class='mt-2'>
        <code>0 ≤ height[i] ≤ 10<sup>4</sup></code>
        </li>`,
	handlerFunction: handlerContainerWithMostWater,
	handlerRun: containerWithMostWaterRun,
	starterCode: starterCodeContainerWithMostWater,
	order: 11,
	starterFunctionName: "function maxArea(",
};
