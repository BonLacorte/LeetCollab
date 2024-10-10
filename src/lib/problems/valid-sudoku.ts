import assert from "assert";
import { Problem } from "@/types/problems";
import example1 from "./images/valid-sudoku-1.png";

const starterCodeValidSudoku = `function isValidSudoku(board) {
  // Write your code here
};`;

// checks if the user has the correct code
const handlerValidSudoku = (fn: any) => {
	try {
		const testCases = [
			{
				board: [
					["5", "3", ".", ".", "7", ".", ".", ".", "."],
					["6", ".", ".", "1", "9", "5", ".", ".", "."],
					[".", "9", "8", ".", ".", ".", ".", "6", "."],
					["8", ".", ".", ".", "6", ".", ".", ".", "3"],
					["4", ".", ".", "8", ".", "3", ".", ".", "1"],
					["7", ".", ".", ".", "2", ".", ".", ".", "6"],
					[".", "6", ".", ".", ".", ".", "2", "8", "."],
					[".", ".", ".", "4", "1", "9", ".", ".", "5"],
					[".", ".", ".", ".", "8", ".", ".", "7", "9"]
				],
				expected: true
			},
			{
				board: [
					["8", "3", ".", ".", "7", ".", ".", ".", "."],
					["6", ".", ".", "1", "9", "5", ".", ".", "."],
					[".", "9", "8", ".", ".", ".", ".", "6", "."],
					["8", ".", ".", ".", "6", ".", ".", ".", "3"],
					["4", ".", ".", "8", ".", "3", ".", ".", "1"],
					["7", ".", ".", ".", "2", ".", ".", ".", "6"],
					[".", "6", ".", ".", ".", ".", "2", "8", "."],
					[".", ".", ".", "4", "1", "9", ".", ".", "5"],
					[".", ".", ".", ".", "8", ".", ".", "7", "9"]
				],
				expected: false
			}
		];

		for (const { board, expected } of testCases) {
			const result = fn(board);
			assert.strictEqual(result, expected);
		}
		return true;
	} catch (error: any) {
		console.log("Valid Sudoku handler function error");
		throw new Error(error);
	}
};

const handlerValidSudokuRun = (fn: any) => {
	try {
		const testCases = [
			{
				board: [
					["5", "3", ".", ".", "7", ".", ".", ".", "."],
					["6", ".", ".", "1", "9", "5", ".", ".", "."],
					[".", "9", "8", ".", ".", ".", ".", "6", "."],
					["8", ".", ".", ".", "6", ".", ".", ".", "3"],
					["4", ".", ".", "8", ".", "3", ".", ".", "1"],
					["7", ".", ".", ".", "2", ".", ".", ".", "6"],
					[".", "6", ".", ".", ".", ".", "2", "8", "."],
					[".", ".", ".", "4", "1", "9", ".", ".", "5"],
					[".", ".", ".", ".", "8", ".", ".", "7", "9"]
				],
				expected: true
			},
			{
				board: [
					["8", "3", ".", ".", "7", ".", ".", ".", "."],
					["6", ".", ".", "1", "9", "5", ".", ".", "."],
					[".", "9", "8", ".", ".", ".", ".", "6", "."],
					["8", ".", ".", ".", "6", ".", ".", ".", "3"],
					["4", ".", ".", "8", ".", "3", ".", ".", "1"],
					["7", ".", ".", ".", "2", ".", ".", ".", "6"],
					[".", "6", ".", ".", ".", ".", "2", "8", "."],
					[".", ".", ".", "4", "1", "9", ".", ".", "5"],
					[".", ".", ".", ".", "8", ".", ".", "7", "9"]
				],
				expected: false
			}
		];
		const testResults = [];

		for (const { board, expected } of testCases) {
			const result = fn(board);
			try {
				assert.strictEqual(result, expected);
				testResults.push({
					case: testResults.length + 1,
					passed: true,
					input: JSON.stringify(board),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			} catch (error: any) {
				testResults.push({
					case: testResults.length + 1,
					passed: false,
					input: JSON.stringify(board),
					expectedOutput: JSON.stringify(expected),
					actualOutput: JSON.stringify(result)
				});
			}
		}
		return testResults;
	} catch (error: any) {
		console.error("Error from validSudokuRun: ", error);
		throw new Error(error);
	}
};

export const validSudoku: Problem = {
	id: "valid-sudoku",
	title: "36. Valid Sudoku",
	problemStatement: `<p class='mt-3'>
	Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:
	</p>
	<ul class='mt-3'>
		<li class='mt-2'>Each row must contain the digits 1-9 without repetition.</li>
		<li class='mt-2'>Each column must contain the digits 1-9 without repetition.</li>
		<li class='mt-2'>Each of the nine 3x3 sub-boxes of the grid must contain the digits 1-9 without repetition.</li>
	</ul>
	<p class='mt-3'>
	A Sudoku board (partially filled) could be valid but not necessarily solvable.
	</p>`,
	examples: [
		{
			id: 1,
			inputText:
				'board =[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
			outputText: "true",
			img: example1.src,
		},
		{
			id: 2,
			inputText:
				'board = [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
			outputText: "false",
		}
	],
	constraints: 
    `<li class='mt-2'>
        <code>board.length == 9</code>
    </li> <li class='mt-2'>
        <code>board[i].length == 9</code>
    </li> <li class='mt-2'>
        <code>board[i][j]</code> is a digit <code>1-9</code> or <code>'.'</code>.
    </li>`,
	handlerFunction: handlerValidSudoku,
	handlerRun: handlerValidSudokuRun,
	starterCode: starterCodeValidSudoku,
	order: 36,
	starterFunctionName: "function isValidSudoku(",
};
