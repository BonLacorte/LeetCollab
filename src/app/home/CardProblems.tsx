'use client'

import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client'; // Importing Socket.IO client
import ConfirmationModal from "./ConfirmationModal";
import { useSession } from 'next-auth/react'; // Assuming you're using NextAuth
import { useGetProblemsQuery, useGetUserSolvedProblemsQuery, useGetUserDataOnProblemQuery } from "../state/api";
import { DBProblem } from "@/types/problems";
import React from "react";
import { BsCheck2Circle } from "react-icons/bs";

const ITEMS_PER_PAGE = 10

const difficulties = ["Easy", "Medium", "Hard"];
const categories = ["Array", "Linked List", "Stack", "Binary Search"];

const CardProblems = ({socket, username}: {socket: Socket | null, username: string | null}) => {
    const { data: session } = useSession(); // Get the session data
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<DBProblem | null>(null);
    
    const { data: problems, isLoading, error } = useGetProblemsQuery();
    const { data: solvedProblemsData, isLoading: isSolvedLoading, error: solvedError } = useGetUserSolvedProblemsQuery(session?.user.id!);

    const handleProblemClick = (problem: DBProblem) => {
        setSelectedProblem(problem);
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        if (selectedProblem && socket) {
            const roomId = Math.random().toString(36).substring(7); // Generate random roomId

            socket.emit('createRoom', { roomId, username, selectedProblem }, (response: any) => {
                // console.log("createRoom username: ", username);
                if (response.success) {
                    router.push(`workspace/room/${roomId}/problem/${selectedProblem.idTitle}`);
                } else {
                    console.error(response.message);
                }
            });
        }
        setIsModalOpen(false);
    };

    if (error) {
        return <div>Error: {error.toString()}</div>;
    }

    const filteredProblems = problems?.filter((problem: DBProblem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedDifficulty || problem.difficulty === selectedDifficulty) &&
        (!selectedCategory || problem.category === selectedCategory)
    );



    const totalPages = Math.ceil(filteredProblems?.length! / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedProblems = filteredProblems?.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }


    // console.log("filteredProblems: ", filteredProblems?.map((problem: DBProblem) => problem.problemId))
    // console.log("solvedProblems: ", solvedProblems)
    // console.log("solvedProblems: ", solvedProblemsData?.map((problem: DBProblem) => problem.problemId))

    return (
        <div className="container mx-auto p-4">
        {isLoading && isSolvedLoading ? (
            <div><p>Loading...</p></div>
        ) : (
            <>
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirm}
                />

                <div className="mb-8 bg-white rounded-xl p-8 shadow-xl">
                    <div className="mb-6">
                        <div className="text-2xl font-semibold text-gray-900 mb-6">Problem Set</div>
                        <div>Search and filter coding challenges</div>
                    </div>
                    <div>
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search problems..."
                                    className="pl-8 border-gray-300 rounded-2xl"
                                    value={searchTerm}
                                    onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)  // Reset to first page on search
                                    }}
                                />
                            </div>
                            <Select  onValueChange={(value) => setSelectedDifficulty(value === "all" ? null : value)}>
                                <SelectTrigger className="w-[180px] border-gray-300 rounded-2xl">
                                    <SelectValue className='dark:text-gray-900 text-gray-100' placeholder="Difficulty"/>
                                </SelectTrigger>
                                <SelectContent className='border-gray-300 rounded-2xl bg-white'>
                                    <SelectItem className='dark:text-gray-900 text-gray-100 hover:text-gray-100 bg-gray-100' value="all">All Difficulties</SelectItem>
                                    {difficulties.map((diff) => (
                                        <SelectItem className='dark:text-gray-900 text-gray-100 hover:text-gray-100 bg-gray-100' key={diff} value={diff}>{diff}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
                                <SelectTrigger className="w-[180px] border-gray-300 rounded-2xl">
                                    <SelectValue className='dark:text-gray-900 text-gray-100' placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className='border-gray-300 rounded-2xl dark:bg-gray-100 bg-gray-900'>
                                    <SelectItem className='dark:text-gray-900 text-gray-100 hover:text-gray-100' value="all">All Categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem className='dark:text-gray-900 text-gray-100 hover:text-gray-100' key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="overflow-x-auto">
                            <Table >
                                <TableHeader>
                                    <TableRow className="border-b border-gray-300">
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="w-[100px]">Difficulty</TableHead>
                                        <TableHead className="w-[150px]">Category</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedProblems?.map((problem: DBProblem) => {
                                        const isSolved = solvedProblemsData?.some(
                                            solvedProblem => solvedProblem.problemId === problem.problemId
                                        );
                                    
                                        return(
                                            <TableRow 
                                            key={problem.problemId} 
                                            onClick={() => handleProblemClick(problem as DBProblem)} 
                                            className="cursor-pointer hover:bg-gray-100 border-b border-gray-300">
                                                <TableCell>
                                                    {isSolved ? (
                                                        <div className="flex items-center">
                                                            <BsCheck2Circle className="text-green-500 mr-2" />
                                                            <span className="text-green-500">Solved</span>
                                                        </div>
                                                    ) : (
                                                        // <Badge variant="outline">New</Badge>
                                                        <div className="flex items-center"></div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{problem.order}. {problem.title}</TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        // variant="outline"
                                                        className={`${problem.difficulty === 'Easy' ? 'bg-green-500' : problem.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'} rounded-xl`}
                                                    >
                                                            {problem.difficulty}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{problem.category}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="flex pt-4 justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProblems?.length!)} of {filteredProblems?.length} problems
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="border-gray-300 hover:border-gray-400 rounded-3xl"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="border-gray-300 hover:border-gray-400 rounded-3xl"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </>             
        )
    }
    </div>
    )
}

export default CardProblems