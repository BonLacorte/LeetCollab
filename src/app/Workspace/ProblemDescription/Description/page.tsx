import React, { useEffect, useMemo, useState } from 'react'
import { BsCheck2Circle } from 'react-icons/bs'
import { AiFillLike, AiFillDislike, AiFillStar, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { TiStarOutline } from 'react-icons/ti'
import { DBProblem, Problem } from '@/types/problems'
import { useSession } from 'next-auth/react'
import CircleSkeletons from '@/components/skeletons/circleSkeletons'
import RectangleSkeletons from '@/components/skeletons/rectangleSkeletons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/app/redux'
import { useGetProblemByIdTitleQuery, useGetUserDataOnProblemQuery, useUpdateUserLikedProblemMutation, useUpdateUserStarredProblemMutation } from '@/app/state/api'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'


type DescriptionProps = {
    problem: Problem | null;
    dbProblem: DBProblem | null;
    idTitle: string;
    // handleLike: () => void;
    // handleStar: () => void;
}

type UserData = {
    solved: boolean;
    liked: boolean;
    starred: boolean;
}

const Description: React.FC<DescriptionProps> = ({ 
    problem, 
    dbProblem,
    idTitle,
    // handleLike,
    // handleStar
}) => {

    const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { data: session } = useSession();
    const [userDataLoading, setUserDataLoading] = useState(true);
    // const [userData, setUserData] = useState<UserData | null>(null);

    const [updateUserLikedProblem] = useUpdateUserLikedProblemMutation();
    const [updateUserStarredProblem] = useUpdateUserStarredProblemMutation();
    const [isLiked, setIsLiked] = useState(false);
    const [isStarred, setIsStarred] = useState(false);

    // equivalent to getCurrentProblem
    // console.log("dbProblem at Description:", dbProblem)
    // equivalent to getUserDataOnProblem
    const { data: userData, isLoading, refetch } = useGetUserDataOnProblemQuery({ 
        idTitle, 
        userId: session?.user?.id ?? '' 
    });

    useEffect(() => {
        if (userData) {
            setIsLiked(userData.liked);
            setIsStarred(userData.starred);
        }
    }, [userData]);

    const handleLike = async () => {
        if (session?.user?.id && dbProblem?.problemId) {
            try {
                await updateUserLikedProblem({
                    userId: session.user.id,
                    problemId: dbProblem?.problemId,
                }).unwrap();
                console.log("liked");
                setIsLiked(!isLiked);
                refetch();
            } catch (error) {
                console.error("Failed to like problem:", error);
            }
        }
    };

    const handleStar = async () => {
        if (session?.user?.id && dbProblem?.problemId) {
            try {
                await updateUserStarredProblem({
                    userId: session?.user?.id,
                    problemId: dbProblem?.problemId,
                }).unwrap();
                console.log("starred");
                setIsStarred(!isStarred);
                refetch();
            } catch (error) {
                console.error("Failed to star problem:", error);
            }
        }
    };

    const difficultyClass = useMemo(() => {
        switch(dbProblem?.difficulty) {
            case "Easy": return "bg-olive text-olive";
            case "Medium": return "bg-dark-yellow text-dark-yellow";
            case "Hard": return "bg-dark-pink text-dark-pink";
            default: return "";
        }
    }, [dbProblem?.difficulty]);

    return (
        <Card className='flex h-full md:h-[85vh] border-none shadow-xl'>
            {isLoading ? (
                <div>
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                </div>
            ) : (
                // <div className=''>
                <div className='w-full h-full p-8 text-gray-900'>
                    {/* <div className='w-full'> */}
                        <div className='flex space-x-4'>
                            <div className='flex-1 mr-2 text-2xl font-bold'>{problem?.title}</div>
                        </div>
                        {/* <CardHeader>
                            <CardTitle>{problem?.title}</CardTitle>
                        </CardHeader> */}
                        
                        <div className='flex items-center mt-3'>
                            <div
                                className='text-lg text-gray-500 font-medium rounded-2xl px-2 py-1 bg-gray-200'
                            >
                                {dbProblem?.difficulty}
                            </div>
                            <div className='rounded p-[3px] ml-4 text-lg font-medium transition-colors duration-200 text-green-s text-dark-green-s'>
                                {userData?.solved === true ? <BsCheck2Circle className='text-green-500' /> : <BsCheck2Circle className='text-dark-gray-6' />}
                            </div>
                            <div
                                className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                onClick={handleLike}
                            >
                                <AiFillLike className={isLiked ? 'text-blue-500' : ''} />
                            </div>
                            <div
                                className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
                                onClick={handleStar}
                            >
                                {isStarred ? <AiFillStar className='text-yellow-500' /> : <TiStarOutline />}
                            </div>
                        </div>

                        <ScrollArea className='h-[70vh]'>

                            {/* Problem Statement(paragraphs) */}
                            <div className='text-lg' dangerouslySetInnerHTML={{ __html: problem?.problemStatement || '' }} />
                        
                            {/* Examples */}
                                {problem?.examples.map((example, index) => (
                                    <div className='my-8' key={example.id}>
                                        <p className='text-lg'>Example {index + 1}: </p>
                                        {example.img && <img src={example.img} alt='' className='mt-3' />}
                                        <div className='example-card'>
                                            <pre className='text-lg'>
                                                <strong>Input: </strong> {example.inputText}
                                                <br />
                                                <strong>Output:</strong>
                                                {example.outputText} <br />
                                                {example.explanation && (
                                                    <>
                                                        <strong>Explanation:</strong> {example.explanation}
                                                    </>
                                                )}
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            

                            {/* Constraints */}
                            <div className='my-8 pb-4'>
                                <div className='text-lg font-medium'>Constraints:</div>
                                <ul className='ml-5 list-disc text-lg'>
                                    <div dangerouslySetInnerHTML={{ __html: problem?.constraints || '' }} />
                                </ul>
                            </div>
                        </ScrollArea>
                </div>
            )}
        </Card>
    )
}

export default Description