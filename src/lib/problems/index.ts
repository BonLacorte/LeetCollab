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
};
