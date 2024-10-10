import assert from "assert";
import { Problem } from "@/types/problems";

const starterCodeMergeSortedArray = `function merge(nums1, m, nums2, n) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerMergeSortedArray = (fn: any) => {
	try {
		const testCases = [
			{
				nums1: [1, 2, 3, 0, 0, 0],
				m: 3,
				nums2: [2, 5, 6],
				n: 3,
				expected: [1, 2, 2, 3, 5, 6],
			},
			{
				nums1: [1],
				m: 1,
				nums2: [],
				n: 0,
				expected: [1],
			},
			{
				nums1: [0],
				m: 0,
				nums2: [1],
				n: 1,
				expected: [1],
			},
		];

		for (const { nums1, m, nums2, n, expected } of testCases) {
			fn(nums1, m, nums2, n);
			assert.deepStrictEqual(nums1, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Merge Sorted Array handler function error");
		throw new Error(error);
	}
};

const handlerMergeSortedArrayRun = (fn: any) => {
	try {
		const testCases = [
			{
				nums1: [1, 2, 3, 0, 0, 0],
				m: 3,
				nums2: [2, 5, 6],
				n: 3,
				expected: [1, 2, 2, 3, 5, 6],
			},
			{
				nums1: [1],
				m: 1,
				nums2: [],
				n: 0,
				expected: [1],
			},
			{
				nums1: [0],
				m: 0,
				nums2: [1],
				n: 1,
				expected: [1],
			},
		];

		const testResults = [];

		for (const { nums1, m, nums2, n, expected } of testCases) {
			const result = fn(nums1, m, nums2, n);
			try {
				assert.deepStrictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify({ nums1, m, nums2, n }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify({ nums1, m, nums2, n }),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from handlerMergeSortedArrayRun: ", error);
		throw new Error(error);
	}
};

export const mergeSortedArray: Problem = {
	id: "merge-sorted-array",
	title: "88. Merge Sorted Array",
	problemStatement: `<p class='mt-3'>
	You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in non-decreasing order, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively.
	</p>
	<p class='mt-3'>
	Merge <code>nums1</code> and <code>nums2</code> into a single array sorted in non-decreasing order.
	</p>
	<p class='mt-3'>
	The final sorted array should not be returned by the function, but instead be stored inside the array <code>nums1</code>. To accommodate this, <code>nums1</code> has a length of <code>m + n</code>, where the first <code>m</code> elements denote the elements that should be merged, and the last <code>n</code> elements are set to <code>0</code> and should be ignored.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
			outputText: "[1,2,2,3,5,6]",
		},
		{
			id: 2,
			inputText: "nums1 = [1], m = 1, nums2 = [], n = 0",
			outputText: "[1]",
		},
		{
			id: 3,
			inputText: "nums1 = [0], m = 0, nums2 = [1], n = 1",
			outputText: "[1]",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>nums1.length == m + n</code>
    </li> <li class='mt-2'>
        <code>nums2.length == n</code>
    </li> <li class='mt-2'>
        <code>0 ≤ m, n ≤ 200</code>
    </li> <li class='mt-2'>
        <code>1 ≤ nums1[i], nums2[i] ≤ 10^9</code>
    </li>`,
	handlerFunction: handlerMergeSortedArray,
	handlerRun: handlerMergeSortedArrayRun,
	starterCode: starterCodeMergeSortedArray,
	order: 88,
	starterFunctionName: "function merge(",
};
