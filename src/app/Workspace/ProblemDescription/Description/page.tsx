import React, { useEffect, useState } from 'react'
import { BsCheck2Circle } from 'react-icons/bs'
import { AiFillLike, AiFillDislike, AiFillStar, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { TiStarOutline } from 'react-icons/ti'
import { DBProblem, Problem } from '@/types/problems'
import { useSession } from 'next-auth/react'
import CircleSkeletons from '@/components/skeletons/circleSkeletons'
import RectangleSkeletons from '@/components/skeletons/rectangleSkeletons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/app/redux'
import { useGetProblemByIdTitleQuery, useGetUserDataOnProblemQuery } from '@/app/state/api'


type DescriptionProps = {
    problem: Problem | null;
    dbProblem: DBProblem | null;
    idTitle: string;
    handleLike: () => void;
    handleStar: () => void;
}

const Description: React.FC<DescriptionProps> = ({ 
    problem, 
    dbProblem,
    idTitle,
    handleLike,
    handleStar
}) => {

    const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { data: session } = useSession();
    const [userDataLoading, setUserDataLoading] = useState(true);

    // equivalent to getCurrentProblem
    // console.log("dbProblem at Description:", dbProblem)
    // equivalent to getUserDataOnProblem
    const { data: userData, isLoading } = useGetUserDataOnProblemQuery({ 
        idTitle, 
        userId: session?.user?.id ?? '' 
    });

    // console.log("userData at Description:", userData)

    return (
        <div className='flex px-0 py-4 h-[calc(100vh-109.5px)]'>
            {isLoading ? (
            <div><p>Loading...</p></div>
            ) : (
                <div className='px-5'>
                    {/* Problem heading */}
                    <div className='w-full'>
                        <div className='flex space-x-4'>
                            <div className='flex-1 mr-2 text-lg font-medium'>{problem?.title}</div>
                        </div>
                        
                            <div className='flex items-center mt-3'>
                                <div
                                    className={`${dbProblem?.difficulty === "Easy" ? 
                                        "bg-olive text-olive" : dbProblem?.difficulty === "Medium" ? "bg-dark-yellow text-dark-yellow" : "bg-dark-pink text-dark-pink"
                                    } inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                                >
                                    {dbProblem?.difficulty}
                                </div>
                                <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                    {userData?.solved === true ? <BsCheck2Circle className='text-green-500' /> : <BsCheck2Circle className='text-dark-gray-6' />}
                                </div>
                                <div
                                    className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                    onClick={handleLike}
                                >
                                    {userData?.liked ? <AiFillLike className='text-blue-500' /> : <AiFillLike />}
                                </div>
                                <div
                                    className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
                                    onClick={handleStar}
                                >
                                    {userData?.starred ? <AiFillStar className='text-yellow-500' /> : <TiStarOutline />}
                                </div>
                            </div>
                        
                        {/* Problem Statement(paragraphs) */}
                        <div className='text-sm'>
                            <div dangerouslySetInnerHTML={{ __html: problem?.problemStatement || '' }} />
                        </div>

                        {/* Examples */}
                        <div className='mt-4'>
                            {problem?.examples.map((example, index) => (
                                <div key={example.id}>
                                    <p className='font-medium '>Example {index + 1}: </p>
                                    {example.img && <img src={example.img} alt='' className='mt-3' />}
                                    <div className='example-card'>
                                        <pre>
                                            <strong className=''>Input: </strong> {example.inputText}
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
                        </div>

                        {/* Constraints */}
                        <div className='my-8 pb-4'>
                            <div className='text-sm font-medium'>Constraints:</div>
                            <ul className='ml-5 list-disc '>
                                <div dangerouslySetInnerHTML={{ __html: problem?.constraints || '' }} />
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Description