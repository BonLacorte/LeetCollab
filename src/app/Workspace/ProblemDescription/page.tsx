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

    const handleLike = async () => {

    };

    const handleStar = async () => {
    };

    return (
        // <div className="flex px-0 py-4 h-[calc(100vh-124px)] overflow-y-auto border">
        <div className="flex px-0 py-4 h-[87vh] overflow-y-auto border-t">
            <Description
                idTitle={idTitle}
                dbProblem={dbProblem}
                problem={problem}
                handleLike={handleLike}
                handleStar={handleStar}
            />
        </div>
    )
}

export default ProblemDescription