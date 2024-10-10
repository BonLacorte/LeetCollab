import assert from "assert";
import { Problem } from "@/types/problems";
import example1 from "./images/word-search-1.jpg";
import example2 from "./images/word-search-2.jpg";
import example3 from "./images/word-search-3.jpg";

const starterCodeWordSearch = `function exist(board, word) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerWordSearch = (fn: any) => {
	try {
		const testCases = [
			{
				board: [
					["A", "B", "C", "E"],
					["S", "F", "C", "S"],
					["A", "D", "E", "E"],
				],
				word: "ABCCED",
				expected: true,
			},
			{
				board: [
					["A", "B", "C", "E"],
					["S", "F", "C", "S"],
					["A", "D", "E", "E"],
				],
				word: "SEE",
				expected: true,
			},
			{
				board: [
					["A", "B", "C", "E"],
					["S", "F", "C", "S"],
					["A", "D", "E", "E"],
				],
				word: "ABCB",
				expected: false,
			},
		];

		for (const { board, word, expected } of testCases) {
			const result = fn(board, word);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Word Search handler function error");
		throw new Error(error);
	}
};

const handlerWordSearchRun = (fn: any) => {
	try {
		const testCases = [
			{
				board: [
					["A", "B", "C", "E"],
					["S", "F", "C", "S"],
					["A", "D", "E", "E"],
				],
				word: "ABCCED",
				expected: true
			},
			{
				board: [
					["A", "B", "C", "E"],
					["S", "F", "C", "S"],
					["A", "D", "E", "E"],
				],
				word: "SEE",
				expected: true
			},
			{
				board: [
					["A", "B", "C", "E"],
					["S", "F", "C", "S"],
					["A", "D", "E", "E"],
				],
				word: "ABCB",
				expected: false
			}
		];
		const testResults = [];
		for (const { board, word, expected } of testCases) {
			const result = fn(board, word);
			try {
				assert.strictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify(board) + ", " + word,
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify(board) + ", " + word,
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from handlerWordSearchRun: ", error);
		throw new Error(error);
	}
};

                
                
                

export const wordSearch: Problem = {
	id: "word-search",
	title: "79. Word Search",
	problemStatement: `<p class='mt-3'>
	Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <em><strong>true</strong> if <code>word</code> exists in the grid</em>.
	</p>
	<p class='mt-3'>
	The word can be constructed from letters of sequentially adjacent cells, where "adjacent" cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.
	</p>`,
	examples: [
		{
			id: 1,
			inputText: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
			outputText: "true",
			img: example1.src,
		},
		{
			id: 2,
			inputText: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
			outputText: "true",
			img: example2.src,
		},
		{
			id: 3,
			inputText: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
			outputText: "false",
			img: example3.src,
		},
	],
	constraints: 
    `<li class='mt-2'>
        <code>m == board.length</code>
    </li> <li class='mt-2'>
        <code>n == board[i].length</code>
    </li> <li class='mt-2'>
        <code>1 ≤ m, n ≤ 6</code>
    </li> <li class='mt-2'>
        <code>1 ≤ word.length ≤ 15</code>
    </li> <li class='mt-2'>
        <code>board[i][j]</code> is a letter from the English alphabet.
    </li>`,
	handlerFunction: handlerWordSearch,
	handlerRun: handlerWordSearchRun,
	starterCode: starterCodeWordSearch,
	order: 79,
	starterFunctionName: "function exist(",
};
