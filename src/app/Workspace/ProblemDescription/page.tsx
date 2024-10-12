import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Submissions from '@/app/workspace/ProblemDescription/Submissions/page'
import Solutions from '@/app/workspace/ProblemDescription/Solutions/page'
import Description from '@/app/workspace/ProblemDescription/Description/page'
import { DBProblem, Problem } from "@/types/problems";
import { useSession } from 'next-auth/react'
import { useUpdateUserLikedProblemMutation, useUpdateUserStarredProblemMutation } from '@/app/state/api'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
    roomId: string;
    idTitle: string;
    dbProblem: DBProblem;
    problem: Problem;
}

const ProblemDescription = ({roomId, idTitle, dbProblem, problem}: Props) => {



    return (
        // <div className="flex px-0 py-4 h-[calc(100vh-124px)] overflow-y-auto border">
        <ScrollArea className="flex h-full">
            <Description
                idTitle={idTitle}
                dbProblem={dbProblem}
                problem={problem}
                // handleLike={handleLike}
                // handleStar={handleStar}
            />
        </ScrollArea>
    )
}

export default ProblemDescription