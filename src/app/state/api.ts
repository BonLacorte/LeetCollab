import { DBProblem } from "@/types/problems";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Problems {
    problems: DBProblem;
}

export interface Problem {
    problem: DBProblem;
}

export interface UsersDataOnProblem {
    usersDataOnProblem: UserDataOnProblem[];
}

export interface UserDataOnProblem {
    liked: boolean;
    starred: boolean;
    solved: boolean;
}

export interface SolvedProblems {
    solvedProblemId: string;
    problemId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}


export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    reducerPath: "api",
    tagTypes: ["Problems", "ProblemByIdTitle", "UserDataOnProblem", "UserSolvedProblems"],
    endpoints: (build) => ({
        getProblems: build.query<DBProblem[], void>({
            query: () => "api/problem/",
            providesTags: (result, error, id) => ["Problems"],
        }),
        getProblemByIdTitle: build.query<DBProblem, string>({
            query: (idTitle: string) => `api/problem/${idTitle}`,
            providesTags: (result, error, idTitle) => ["ProblemByIdTitle"],
        }),
        getUserDataOnProblem: build.query<UserDataOnProblem, { idTitle: string; userId: string }>({
            query: ({ idTitle, userId }) => `api/problem/${idTitle}/${userId}`,
            providesTags: ["UserDataOnProblem"],
            transformResponse: (response: { data: { liked: boolean; starred: boolean; solved: boolean } }) => ({
                liked: response.data.liked,
                starred: response.data.starred,
                solved: response.data.solved,
            }),
            transformErrorResponse: (response: { status: number; data: { message: string } }) => ({
                status: response.status,
                message: response.data.message,
            }),
        }),
        getSolvedProblems: build.query<SolvedProblems, string>({
            query: (userId: string) => `api/user/problem/solved/${userId}`,
            providesTags: ["UserSolvedProblems"],
        }),
        updateUserProblemSolved: build.mutation<void, { userId: string; problemId: string }>({
            query: ({ userId, problemId }) => ({
                url: `api/user/problem/solved`,
                method: 'POST',
                body: { userId, problemId },
            }),
            invalidatesTags: ["UserSolvedProblems"],
        }),
    }),
});

export const { useGetProblemsQuery, useGetProblemByIdTitleQuery, useGetUserDataOnProblemQuery, useGetSolvedProblemsQuery, useUpdateUserProblemSolvedMutation } = api;
