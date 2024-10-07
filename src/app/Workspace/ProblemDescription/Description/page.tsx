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
    // isSolved: boolean;
}

const Description: React.FC<DescriptionProps> = ({ 
    problem, 
    dbProblem,
    idTitle,
    handleLike,
    handleStar
    // isSolved
}) => {

    const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { data: session } = useSession();
    const [userDataLoading, setUserDataLoading] = useState(true);

    // equivalent to getCurrentProblem
    console.log("dbProblem at Description:", dbProblem)
    // equivalent to getUserDataOnProblem
    const { data: userData, isLoading } = useGetUserDataOnProblemQuery({ 
        idTitle, 
        userId: session?.user?.id ?? '' 
    });

    console.log("userData at Description:", userData)

    // useEffect(() => {
    //     // const getCurrentProblem = async () => {
    //     //     setLoading(true);
    //     //     try {
    //     //         const response = await fetch(`/api/problem/${idTitle}`);
    //     //         const problem: DBProblem = await response.json();
    //     //         console.log("Fetched problem:", problem);
    //     //         setCurrentProblem(problem);
    //     //         setLoading(false);
    //     //     } catch (error) {
    //     //         console.error("Error fetching problem:", error);
    //     //         setLoading(false);
    //     //     }
    //     // };
    //     // getCurrentProblem();
        
    //     // setCurrentProblem(problem);
    //     // setLoading(isLoading);

    // }, [idTitle]);

    // const { data: fetchProblem, isLoading } = useGetProblemByIdTitleQuery(idTitle);
    // console.log("problem:", fetchProblem)


    // useEffect(() => {
    //     if (session?.user.id && idTitle) {
    //         dispatch(fetchProblemData({ idTitle, userId: session.user.id }));
    //     }
    // }, [dispatch, idTitle, session?.user.id]);

    // useEffect(() => {
    //     console.log("Current data state:", data);
    // }, [data]);

    // if (loading) {
    //     return (
    //         <div className='mt-3 flex space-x-2'>
    //             <RectangleSkeletons />
    //             <CircleSkeletons />
    //             <CircleSkeletons />
    //             <RectangleSkeletons />
    //             <CircleSkeletons />
    //         </div>
    //     );
    // }

    return (
        <div className='flex px-0 py-4 h-[calc(100vh-109.5px)] overflow-y-auto'>
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
                        

                        {/* {loading || userDataLoading (
                            <div className='mt-3 flex space-x-2'>
                                <RectangleSkeletons />
                                <CircleSkeletons />
                                <CircleSkeletons />
                                <RectangleSkeletons />
                                <CircleSkeletons />
                            </div>
                        )} */}

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

// function useGetCurrentProblem(idTitle: string) {
// 	const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
// 	const [loading, setLoading] = useState<boolean>(true);
// 	const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");

// 	useEffect(() => {
//         const fetchProblemByIdTitle = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetch(`/api/problem/${idTitle}`);
//                 const problem: DBProblem = await response.json();
//                 console.log("Fetched problem:", problem);
                
//                 if (problem && problem.difficulty) {
//                     setCurrentProblem(problem);
//                     console.log("problem.difficulty:", problem.difficulty);
//                     setProblemDifficultyClass(
//                         problem.difficulty === "Easy"
//                             ? "bg-olive text-olive"
//                             : problem.difficulty === "Medium"
//                             ? "bg-dark-yellow text-dark-yellow"
//                             : "bg-dark-pink text-dark-pink"
//                     );
//                 } else {
//                     console.error("Problem or difficulty is undefined");
//                 }
//             } catch (error) {
//                 console.error("Error fetching problem:", error);
//             }
//             setLoading(false);
//         };
//         fetchProblemByIdTitle();
//     }, [idTitle]);

// 	return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
// }

// function useGetUsersDataOnProblem(idTitle: string) {
//     const { data: session } = useSession();
//     const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false });

//     useEffect(() => {
//         const getUsersDataOnProblem = async () => {
//             if (session?.user.id) {
//                 try {
//                     const response = await fetch(`/api/problem/${idTitle}/${session?.user.id}`, {
//                         method: "GET",
//                         // params: { email: session.user.email, problemId }
//                     });
//                     const data = await response.json();
//                     console.log("Page Description useGetUsersDataOnProblem data: ", data);

//                     setData(data);
//                 } catch (error) {
//                     console.error("Error fetching user's problem data:", error);
//                 }
//             }
//         };

//         if (session?.user.username) getUsersDataOnProblem();
//     }, [idTitle, session]);

//     return { ...data, setData };
// }