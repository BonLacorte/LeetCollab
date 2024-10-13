'use client'

// import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import { useGetUserSolvedProblemsQuery, useGetUserProfileQuery, useGetUserSubmissionsQuery, useGetProblemsQuery, useGetUserRankAndAcceptanceRateQuery } from '@/app/state/api';
import { Calendar, User } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import SolvedProblemsChart from '@/components/profile/SolvedProblemsChart';
import SubmissionsActivityChart from '@/components/profile/SubmissionActivityChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DBProblem } from '@/types/problems';
import CardSolvedProblems from '@/components/profile/CardSolvedProblems';
import CardSubmissions from '@/components/profile/CardSubmissions';
import CommunityStats from '@/components/profile/CommunityStats';
import Language from '@/components/profile/Language';
import Skills from '@/components/profile/Skills';
import RankAcceptanceRate from '@/components/profile/RankAcceptanceRate';
import TopUsers from '@/components/profile/TopUsers';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import CardStarredProblems from '@/components/profile/CardStarredProblems';
import { Button } from '@/components/ui/button';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { useUpdateUserProfileMutation } from '@/app/state/api';
import user from '@/lib/problems/images/user.jpg' 

type Props = {}

type FetchedSolvedProblems = {
    problemId: string;
    problem: DBProblem;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const Profile = ({ params }: { params: { userId: string } }) => {

    const { data: session } = useSession();
    const { data: userProfile, isLoading, error } = useGetUserProfileQuery(params.userId);
    const { data: solvedProblems, isLoading: solvedProblemsLoading, error: solvedProblemsError } = useGetUserSolvedProblemsQuery(params.userId);
    const { data: submissions, isLoading: submissionsLoading, error: submissionsError } = useGetUserSubmissionsQuery(params.userId);
    const { data: problems, isLoading: problemsLoading, error: problemsError } = useGetProblemsQuery();
    const { data: userRankAndAcceptanceRate, isLoading: userRankAndAcceptanceRateLoading, error: userRankAndAcceptanceRateError } = useGetUserRankAndAcceptanceRateQuery(params.userId);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updateUserProfile] = useUpdateUserProfileMutation();
    
    console.log("userProfile: ", userProfile);
    console.log("solvedProblems: ", solvedProblems);
    console.log("submissions: ", submissions);
    console.log("problems: ", problems);
    console.log("userRankAndAcceptanceRate: ", userRankAndAcceptanceRate);

    // get the total of easy, medium, and hard problems
    // get the total of easy, medium, and hard problems
    const totalEasyProblems = problems && Array.isArray(problems) 
    ? problems.filter((problem) => problem.difficulty === "Easy").length 
    : 0;
    const totalMediumProblems = problems && Array.isArray(problems) 
    ? problems.filter(problem => problem.difficulty === "Medium").length 
    : 0;
    const totalHardProblems = problems && Array.isArray(problems) 
    ? problems.filter(problem => problem.difficulty === "Hard").length 
    : 0;

    console.log("totalEasyProblems: ", totalEasyProblems);
    console.log("totalMediumProblems: ", totalMediumProblems);
    console.log("totalHardProblems: ", totalHardProblems);

    // get the total of solved easy, medium, and hard problems
    const totalEasySolved = solvedProblems && Array.isArray(solvedProblems)
    ? solvedProblems.filter((solvedProblem: any) => solvedProblem.problem.difficulty === "Easy").length
    : 0;
    const totalMediumSolved = solvedProblems && Array.isArray(solvedProblems)
    ? solvedProblems.filter((solvedProblem: any) => solvedProblem.problem.difficulty === "Medium").length
    : 0;
    const totalHardSolved = solvedProblems && Array.isArray(solvedProblems)
    ? solvedProblems.filter((solvedProblem: any) => solvedProblem.problem.difficulty === "Hard").length
    : 0;

    console.log("Total Easy Solved:", totalEasySolved);
    console.log("Total Medium Solved:", totalMediumSolved);
    console.log("Total Hard Solved:", totalHardSolved);

    // Calculate the total solved problems and total problems
    const totalSolved = totalEasySolved + totalMediumSolved + totalHardSolved;
    const totalProblems = totalEasyProblems + totalMediumProblems + totalHardProblems;

    // Calculate the percentage of solved problems
    const solvedPercentage = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;

    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error loading profile</div>;

    return (
        // <div className="container mx-auto p-4">
        <>
            {isLoading && solvedProblemsLoading && submissionsLoading && problemsLoading && userRankAndAcceptanceRateLoading ? (
                <div className='flex justify-center items-center min-h-screen'>
                    <div className="flex flex-col justify-center items-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                        <p className='text-lg font-medium text-gray-900 mt-4'>Loading...</p>
                    </div>
                </div>
            ) : (
                <div className='h-full'>
                    <Navbar/>
                    <div className="container flex justify-center mx-auto px-4 py-8">
                        <div className="flex xl:w-3/5 lg:w-4/5 md:w-10/12 flex-col md:flex-row gap-8">
                            {/* Left column */}
                            <div className="flex flex-col md:w-1/3 bg-white p-6 gap-6 shadow-xl rounded-xl">
                                <div className="flex items-center md:flex-col text-center">
                                    <Image
                                        src={userProfile?.image || user}
                                        alt={userProfile?.image || 'User'}
                                        width={80}
                                        height={80}
                                        className="rounded-full mr-4 md:mr-0"
                                    />
                                    <div>
                                        <h1 className="mt-4 text-2xl">{userProfile?.name}</h1>
                                        <p className="text-sm text-gray-500">@{userProfile?.username}</p>
                                        {session?.user?.id === params.userId && (
                                            <Button onClick={() => setIsEditModalOpen(true)} className="mt-2">
                                                Edit Profile
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <Separator/>
                                <Skills solvedProblems={solvedProblems || []}/> 
                                <Separator/>
                                <TopUsers topUsers={userRankAndAcceptanceRate?.topUsers || []} userRank={userRankAndAcceptanceRate?.userRank || 0} userAcceptanceRate={userRankAndAcceptanceRate?.userAcceptanceRate || 0}/>
                            </div>
                
                            {/* Right column */}
                            <div className="md:w-2/3 flex flex-col gap-8">
                                <div className='flex flex-col w-full shadow-md rounded-xl'>
                                    <div className='flex flex-col w-full bg-white rounded-xl p-6 gap-4'>
                                        <div className='flex flex-row justify-around gap-2'>
                                            <div className="space-y-2 text-center">
                                                <div className="text-3xl font-bold">{totalSolved}</div>
                                                <p className="text-sm text-gray-500">Problems Solved</p>
                                            </div>
                                            <div className="space-y-2 text-center">
                                                <div className="text-3xl font-bold">{userRankAndAcceptanceRate?.userRank}</div>
                                                <p className="text-sm text-gray-500">Rank</p>
                                            </div>
                                            <div className="space-y-2 text-center">
                                                <div className="text-3xl font-bold">{userRankAndAcceptanceRate?.userAcceptanceRate.toFixed(2)}%</div>
                                                <p className="text-sm text-gray-500">Acceptance Rate</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col bg-white gap-2'>
                                            <div className="flex justify-around bg-white text-sm">
                                                <span>Easy {totalEasySolved}/{totalEasyProblems}</span>
                                                <span>Medium {totalMediumSolved}/{totalMediumProblems}</span>
                                                <span>Hard {totalHardSolved}/{totalHardProblems}</span>
                                            </div>
                                            <Progress value={solvedPercentage} className="w-full h-2" />
                                        </div>
                                    </div>
                                </div>
                    
                                <Tabs defaultValue="solved" className="bg-white p-8 rounded-xl shadow-xl">
                                    <TabsList className='bg-white flex justify-start gap-2'>
                                        <TabsTrigger value="solved" className="border border-gray-300 bg-white focus:border-gray-200 hover:border-gray-200 hover:bg-gray-200 text-gray-900 rounded-2xl px-4 py-2 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-900">Solved</TabsTrigger>
                                        <TabsTrigger value="submissions" className="border border-gray-300 bg-white focus:border-gray-200 hover:border-gray-200 hover:bg-gray-200 text-gray-900 rounded-2xl px-4 py-2 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-900">Submissions</TabsTrigger>
                                        <TabsTrigger value="starred" className="border border-gray-300 bg-white focus:border-gray-200 hover:border-gray-200 hover:bg-gray-200 text-gray-900 rounded-2xl px-4 py-2 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-900">Starred</TabsTrigger>
                                        {/* <TabsTrigger value="solutions">Solutions</TabsTrigger>
                                        <TabsTrigger value="discuss">Discuss</TabsTrigger> */}
                                    </TabsList>
                                    <TabsContent value="solved" className="py-4">
                                        <CardSolvedProblems/>
                                    </TabsContent>
                                    <TabsContent value="submissions" className="p-4">
                                        <CardSubmissions/>
                                    </TabsContent>
                                    <TabsContent value="starred" className="p-4">
                                        <CardStarredProblems/>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {session?.user?.id === params.userId && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    userProfile={{
                        userId: userProfile?.userId || '',
                        name: userProfile?.name || '',
                        username: userProfile?.username || '',
                        email: userProfile?.email || '',
                        image: userProfile?.image || '',
                    }}
                    onSave={async (updatedProfile) => {
                        try {
                            await updateUserProfile({
                                userId: session.user.id,
                                ...updatedProfile,
                            }).unwrap();
                            // Refetch user profile data or update local state
                            // You might need to add a refetch function to your useGetUserProfileQuery hook
                        } catch (error) {
                            console.error('Failed to update profile:', error);
                            // Handle error (e.g., show an error toast)
                        }
                    }}
                />
            )}
        </>
    )
}


export default Profile