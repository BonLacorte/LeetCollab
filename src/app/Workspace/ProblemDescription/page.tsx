import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Submissions from './Submissions/page'
import Solutions from './Solutions/page'
import Description from './Description/page'

type Props = {
    roomId: string;
    problemId: string;
}

const ProblemDescription = ({roomId, problemId}: Props) => {
    return (
        <div className='border-red-200'>
            <div className='flex justify-between'>
                <h1>Room ID: {roomId}</h1>
                <h2>Problem ID: {problemId}</h2>
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
                        <Description/>

                    </TabsContent>
                    <TabsContent value="solutions" className="p-4"><Solutions/></TabsContent>
                    <TabsContent value="submissions" className="p-4"><Submissions/></TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ProblemDescription