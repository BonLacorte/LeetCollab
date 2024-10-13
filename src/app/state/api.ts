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

export interface User {
    userId: string;
    name: string;
    username: string;
    email: string;
    role: string;
    password: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Submission {
    submissionId: string;
    problemId: string;
    userId: string;
    status: string;
    createdAt: Date;
}

export interface UpdateUserProfile {
    name: string;
    username: string;
    email: string;
    image: string;
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    reducerPath: "api",
    tagTypes: ["Problems", "ProblemByIdTitle", "UserDataOnProblem", "UserSolvedProblems", "UserLikedProblem", "UserStarredProblem", "UserSubmission", "UserProfile", "UserRankAndAcceptanceRate", "UpdateUserProfile"],
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
        getUserSolvedProblems: build.query<SolvedProblems[], string>({
            query: (userId: string) => `api/user/problem/solved/${userId}`,
            providesTags: ["UserSolvedProblems"],
        }),
        getUserSubmissions: build.query<Submission[], string>({
            query: (userId: string) => `api/user/problem/submission/${userId}`,
            providesTags: ["UserSubmission"],
        }),
        getUserStarredProblems: build.query<any[], string>({
            query: (userId: string) => `api/user/problem/starred/${userId}`,
            providesTags: ["UserStarredProblem"],
        }),
        getUserProfile: build.query<User, string>({
            query: (userId: string) => `api/user/${userId}`,
            providesTags: ["UserProfile"],
        }),
        getUserRankAndAcceptanceRate: build.query<{ userRank: number; userAcceptanceRate: number; topUsers: any[]; }, string>({
            query: (userId: string) => `api/user/problem/${userId}`,
            providesTags: ["UserRankAndAcceptanceRate"],
        }),
        updateUserSolvedProblem: build.mutation<void, { userId: string; problemId: string }>({
            query: ({ userId, problemId }) => ({
                url: `api/user/problem/solved`,
                method: 'POST',
                body: { userId, problemId },
            }),
            invalidatesTags: ["UserSolvedProblems"],
        }),
        updateUserLikedProblem: build.mutation<void, { userId: string; problemId: string }>({
            query: ({ userId, problemId }) => ({
                url: `api/user/problem/liked`,
                method: 'POST',
                body: { userId, problemId },
            }),
            invalidatesTags: ["UserLikedProblem"],
        }),
        updateUserStarredProblem: build.mutation<void, { userId: string; problemId: string }>({
            query: ({ userId, problemId }) => ({
                url: `api/user/problem/starred`,
                method: 'POST',
                body: { userId, problemId },
            }),
            invalidatesTags: ["UserStarredProblem"],
        }),
        updateUserProfile: build.mutation<void, { userId: string; patch: UpdateUserProfile }>({
            query: ({ userId, ...patch }) => ({
                url: `/api/user`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ["UserProfile"],
        }),
        createSubmission: build.mutation<void, { userId: string; problemId: string; status: string }>({
            query: ({ userId, problemId, status }) => ({
                url: `api/user/problem/submission`,
                method: 'POST',
                body: { userId, problemId, status },
            }),
            invalidatesTags: ["UserSubmission"],
        }),
    }),
});

export const { useGetProblemsQuery, useGetProblemByIdTitleQuery, useGetUserDataOnProblemQuery, useGetUserSolvedProblemsQuery, useGetUserSubmissionsQuery, useGetUserStarredProblemsQuery, useLazyGetUserProfileQuery, useUpdateUserSolvedProblemMutation, useUpdateUserLikedProblemMutation, useUpdateUserStarredProblemMutation, useCreateSubmissionMutation, useGetUserProfileQuery, useGetUserRankAndAcceptanceRateQuery, useUpdateUserProfileMutation } = api;
