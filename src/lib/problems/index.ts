import { Problem } from "@/types/problems";
import { jumpGame } from "./jump-game";
import { reverseLinkedList } from "./reverse-linked-list";
import { search2DMatrix } from "./search-a-2d-matrix";
import { twoSum } from "./two-sum";
import { validParentheses } from "./valid-parentheses";
import { containerWithMostWater } from "./container-with-most-water";
import { mergeIntervals } from "./merge-intervals";
import { bestTimeToBuyAndSellStock } from "./best-time-to-buy-and-sell-stock";
import { maximumDepthOfBinaryTree } from "./maximum-depth-of-binary-tree";
import { waterBottles } from "./water-bottles";
import { nextPermutation } from "./next-permutation";
import { longestPalindromicSubstring } from "./longest-palindromic-substring";
import { validSudoku } from "./valid-sudoku";
import { subsets } from "./subsets";
import { wordSearch } from "./word-search";
import { mergeSortedArray } from "./merge-sorted-array";
import { canPlaceFlowers } from "./can-place-flowers";
import { reverseVowels } from "./reverse-vowels-of-a-string";
import { kidsWithCandies } from "./kids-with-the-greatest-number-of-candies";
import { gcdOfStrings } from "./greatest-common-divisor-of-string";
import { longestValidParentheses } from "./longest-valid-parentheses";
import { mergeAlternately } from "./merge-strings-alternately";
import { minWindow } from "./minimum-window-substring";
interface ProblemMap {
	[key: string]: Problem;
}

export const problems: ProblemMap = {
	"two-sum": twoSum,
	"reverse-linked-list": reverseLinkedList,
	"jump-game": jumpGame,
	"search-a-2d-matrix": search2DMatrix,
	"valid-parentheses": validParentheses,
	"container-with-most-water": containerWithMostWater,
	"merge-intervals": mergeIntervals,
	"best-time-to-buy-and-sell-stock": bestTimeToBuyAndSellStock,
	"maximum-depth-of-binary-tree": maximumDepthOfBinaryTree,
	"water-bottles": waterBottles,
	// "next-permutation": nextPermutation,
	// "longest-palindromic-substring": longestPalindromicSubstring,
	"valid-sudoku": validSudoku,
	"subsets": subsets,
	"word-search": wordSearch,
	// "merge-sorted-array": mergeSortedArray,
	"can-place-flowers": canPlaceFlowers,
	"reverse-vowels-of-a-string": reverseVowels,
	"kids-with-the-greatest-number-of-candies": kidsWithCandies,
	"greatest-common-divisor-of-strings": gcdOfStrings,
	"longest-valid-parentheses": longestValidParentheses,
	"merge-strings-alternately": mergeAlternately,
	"minimum-window-substring": minWindow,	
};
