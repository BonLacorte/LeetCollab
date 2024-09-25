import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Submissions from '@/app/workspace/ProblemDescription/Submissions/page'
import Solutions from '@/app/workspace/ProblemDescription/Solutions/page'
import Description from '@/app/workspace/ProblemDescription/Description/page'
import { DBProblem, Problem } from "@/types/problems";
import { useSession } from 'next-auth/react'

type Props = {
    roomId: string;
    idTitle: string;
    dbProblem: DBProblem;
    problem: Problem;
}

const ProblemDescription = ({roomId, idTitle, dbProblem, problem}: Props) => {

    
	const [updating, setUpdating] = useState(false);

    // const returnUserDataAndProblemData = async (transaction: any) => {
	// 	const userRef = doc(firestore, "users", user!.uid);
	// 	const problemRef = doc(firestore, "problems", problem.id);
	// 	const userDoc = await transaction.get(userRef);
	// 	const problemDoc = await transaction.get(problemRef);
	// 	return { userDoc, problemDoc, userRef, problemRef };
	// };

    const handleLike = async () => {
        // Implement like functionality
    };

    const handleStar = async () => {
        // Implement star functionality
    };

    return (
        <div className='border-red-200'>
            <div className='flex justify-between'>
                <h1>Room ID: {roomId}</h1>
                <h2>Problem Title: {idTitle}</h2>
            </div>
            {/* Left side */}
            <div className="overflow-auto border border-red-950">
                <Tabs defaultValue="description">
                    <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="solutions">Solutions</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="p-4">
                        <Description
                            // problem={currentProblem} 
                            idTitle={idTitle}
                            dbProblem={dbProblem}
                            problem={problem}
                            // solved={solved}
                            // liked={liked}
                            // starred={starred}
                            handleLike={handleLike}
                            handleStar={handleStar}
                        />

                    </TabsContent>
                    <TabsContent value="solutions" className="p-4"><Solutions/></TabsContent>
                    <TabsContent value="submissions" className="p-4"><Submissions/></TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ProblemDescription