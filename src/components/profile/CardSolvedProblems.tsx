import { SolvedProblems, useGetUserSolvedProblemsQuery } from '@/app/state/api';
import { DBProblem } from '@/types/problems';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { BsCheck2Circle } from 'react-icons/bs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import ConfirmationModal from '@/app/home/ConfirmationModal';
// import { io, Socket } from 'socket.io-client'; // Importing Socket.IO client


type Props = {}

const ITEMS_PER_PAGE = 10

const difficulties = ["Easy", "Medium", "Hard"];
const categories = ["Array", "Linked List", "Stack", "Binary Search"];

const CardSolvedProblems = (props: Props) => {
    const { data: session } = useSession(); // Get the session data
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<DBProblem | null>(null);

    const { data: solvedProblems, isLoading, error } = useGetUserSolvedProblemsQuery(session?.user.id!);    

    const handleProblemClick = (problem: DBProblem) => {
        setSelectedProblem(problem);
        setIsModalOpen(true);
    };

    // const handleConfirm = () => {
    //     if (selectedProblem && socket) {
    //         const roomId = Math.random().toString(36).substring(7); // Generate random roomId

    //         socket.emit('createRoom', { roomId, username, selectedProblem }, (response: any) => {
    //             // console.log("createRoom username: ", username);
    //             if (response.success) {
    //                 router.push(`workspace/room/${roomId}/problem/${selectedProblem.idTitle}`);
    //             } else {
    //                 console.error(response.message);
    //             }
    //         });
    //     }
    //     setIsModalOpen(false);
    // };

    if (error) {
        return <div>Error: {error.toString()}</div>;
    }

    const filteredSolvedProblems = solvedProblems?.filter((problem: any) =>
        problem.problem.problemId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedDifficulty || problem.problem.difficulty === selectedDifficulty) &&
        (!selectedCategory || problem.problem.category === selectedCategory)
    );

    console.log("filteredSolvedProblems: ", filteredSolvedProblems);

    const totalPages = Math.ceil(filteredSolvedProblems?.length! / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedProblems = filteredSolvedProblems?.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    return (
        <div className="container mx-auto">
        {isLoading ? (
            <div><p>Loading...</p></div>
        ) : (
            <>
                {/* <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirm}
                /> */}

                <div className="mb-8 rounded-lg ">
                    {/* <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-900 mb-6">Problem Set</CardTitle>
                        <CardDescription>Search and filter coding challenges</CardDescription>
                    </CardHeader> */}
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
                            <Select onValueChange={(value) => setSelectedDifficulty(value === "all" ? null : value)}>
                                <SelectTrigger className="w-[180px] border-gray-300 rounded-2xl">
                                    <SelectValue className='dark:text-gray-900 text-gray-100' placeholder="Difficulty"/>
                                </SelectTrigger>
                                <SelectContent className='border-gray-300 rounded-2xl bg-white'>
                                    <SelectItem className='dark:text-gray-900 text-gray-100 hover:text-gray-100' value="all">All Difficulties</SelectItem>
                                    {difficulties.map((diff) => (
                                        <SelectItem className='dark:text-gray-900 text-gray-100 hover:text-gray-100' key={diff} value={diff}>{diff}</SelectItem>
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
                                {paginatedProblems?.map((solvedProblem: any) => {
                                    const problem = solvedProblem.problem;  // Access the nested problem object
                                    
                                    return(
                                        <TableRow 
                                        key={problem.problemId} 
                                        onClick={() => handleProblemClick(problem as DBProblem)} 
                                        className="cursor-pointer hover:bg-gray-100">
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <BsCheck2Circle className="text-green-500 mr-2" />
                                                    <span className="text-green-500">Solved</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{problem.order}. {problem.title}</TableCell>
                                            <TableCell>
                                                <Badge 
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
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredSolvedProblems?.length!)} of {filteredSolvedProblems?.length} problems
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
                    </div>
                </div>
            </>             
        )
    }
    </div>
    )
}

export default CardSolvedProblems