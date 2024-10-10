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
import { useGetProblemsQuery, useGetSolvedProblemsQuery, useGetUserDataOnProblemQuery } from "../state/api";
import { DBProblem } from "@/types/problems";
import React from "react";
import { BsCheck2Circle } from "react-icons/bs";

type Problem = {
    problemId: number;
    idTitle: string;
    title: string;
    difficulty: string;
    category: string;
    order: number;
    description: string;
    
}

const ITEMS_PER_PAGE = 10

const difficulties = ["Easy", "Medium", "Hard"];
const categories = ["Array", "Linked List", "Stack", "Binary Search"];

const CardProblems = ({socket, username}: {socket: Socket | null, username: string | null}) => {
    const { data: session } = useSession(); // Get the session data
    // const [username, setUsername] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    // const [problems, setProblems] = useState<Problem[]>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<DBProblem | null>(null);
    
    const { data: problems, isLoading, error } = useGetProblemsQuery();
    const { data: solvedProblemsData, isLoading: isSolvedLoading, error: solvedError } = useGetSolvedProblemsQuery(session?.user.id!);

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

    const problemsArray = problems?.problems || [];
    
    if (error) {
        return <div>Error: {error.toString()}</div>;
    }

    const filteredProblems = problemsArray.filter((problem: DBProblem) =>
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

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Problem Set</CardTitle>
                        <CardDescription>Search and filter coding challenges</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search problems..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)  // Reset to first page on search
                                    }}
                                />
                            </div>
                            <Select onValueChange={(value) => setSelectedDifficulty(value === "all" ? null : value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Difficulties</SelectItem>
                                    {difficulties.map((diff) => (
                                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
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
                                            className="cursor-pointer hover:bg-gray-100">
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
                                                    <Badge variant="outline">{problem.difficulty}</Badge>
                                                </TableCell>
                                                <TableCell>{problem.category}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProblems?.length!)} of {filteredProblems?.length} problems
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
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
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </>             
        )
    }
    </div>
    )
}

export default CardProblems