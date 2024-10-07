export type Example = {
    id: number;
    inputText: string;
    outputText: string;
    explanation?: string;
    img?: string;
}

// local problem data
export type Problem = {
	id: string;
	title: string;
	problemStatement: string;
	examples: Example[];
	constraints: string;
	order: number;
	starterCode: string;
	handlerFunction: ((fn: any) => boolean) | string;
	starterFunctionName: string;
};

export type DBProblem = {
    problemId: string;
    idTitle: string;
    title: string;
    category: string;
    difficulty: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export type Message = {
    sender: string;
    content: string;
    timestamp: Date;
};

export type TestCase = {
    case: number;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
}