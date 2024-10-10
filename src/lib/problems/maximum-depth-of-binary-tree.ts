import assert from "assert";
import { Problem } from "@/types/problems";

class TreeNode {
	val: number;
	left: TreeNode | null;
	right: TreeNode | null;
	constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
		this.val = val === undefined ? 0 : val;
		this.left = left === undefined ? null : left;
		this.right = right === undefined ? null : right;
	}
}

const starterCodeMaxDepth = `function maxDepth(root) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerMaxDepth = (fn: any) => {
	try {
		const testCases = [
			// Tree: [3,9,20,null,null,15,7]
			{
				root: new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7))),
				expected: 3,
			},
			// Tree: [1,null,2]
			{
				root: new TreeNode(1, null, new TreeNode(2)),
				expected: 2,
			},
			// Empty Tree: []
			{
				root: null,
				expected: 0,
			},
		];

		// loop all tests to check if the user's code is correct
		for (const { root, expected } of testCases) {
			const result = fn(root);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Maximum Depth of Binary Tree handler function error");
		throw new Error(error);
	}
};

const maxDepthRun = (fn: any) => {
	try {
		const testResults = [] as { case: number; passed: boolean; input: any; expectedOutput: string; actualOutput: string }[];
		const tests = [
			// Tree: [3,9,20,null,null,15,7]
			{
				root: new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7))),
				expected: 3,
			},
			// Tree: [1,null,2]
			{
				root: new TreeNode(1, null, new TreeNode(2)),
				expected: 2,
			},
			// Empty Tree: []
			{
				root: null,
				expected: 0,
			},
		];
		for (const { root, expected } of tests) {
			const result = fn(root);
			try {
				assert.strictEqual(result, expected);

				// add test result
				testResults.push({
					case: testResults.length + 1,
					passed: JSON.stringify(result) === JSON.stringify(expected),
					input: "root: " + JSON.stringify(root),
					expectedOutput: expected.toString(),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				console.error("Error from maxDepthRun: ", error);
				// throw new Error(error);

				// add test result
				testResults.push({
					case: testResults.length + 1,
					passed: JSON.stringify(result) === JSON.stringify(expected),
					input: "root: " + JSON.stringify(root),
					expectedOutput: expected.toString(),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.log("Error from maxDepthRun: ", error);
		throw new Error(error);
	}
};

export const maximumDepthOfBinaryTree: Problem = {
	id: "maximum-depth-of-binary-tree",
	title: "104. Maximum Depth of Binary Tree",
	problemStatement: `<p class='mt-3'>
	Given the <code>root</code> of a binary tree, return <em>its maximum depth</em>.
	</p>
	<p class='mt-3'>A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>`,
	examples: [
		{
			id: 1,
			inputText: "root = [3,9,20,null,null,15,7]",
			outputText: "3",
		},
		{
			id: 2,
			inputText: "root = [1,null,2]",
			outputText: "2",
		},
		{
			id: 3,
			inputText: "root = []",
			outputText: "0",
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>The number of nodes in the tree is in the range [0, 10<sup>4</sup>].</code>
    </li> <li class='mt-2'>
        <code>-100 ≤ Node.val ≤ 100</code>
    </li>`,
	handlerFunction: handlerMaxDepth,
	handlerRun: maxDepthRun,
	starterCode: starterCodeMaxDepth,
	order: 104,
	starterFunctionName: "function maxDepth(",
};
