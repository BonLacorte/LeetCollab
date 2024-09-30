import React, { useEffect, useState } from 'react'
import { BsCheck2Circle } from 'react-icons/bs'
import { AiFillLike, AiFillDislike, AiFillStar, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { TiStarOutline } from 'react-icons/ti'
import { DBProblem, Problem } from '@/types/problems'
import { useSession } from 'next-auth/react'

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
    // loading, 
    idTitle,
    handleLike,
    handleStar 
}) => {

    const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrentProblem(idTitle);
    const { liked, solved, setData, starred } = useGetUsersDataOnProblem(idTitle);
    const [updating, setUpdating] = useState(false);

    return (
        <div className=''>
            <div className='flex px-0 py-4 h-[calc(100vh-109.5px)] overflow-y-auto'>
                <div className='px-5'>
                    {/* Problem heading */}
                    <div className='w-full'>
                        <div className='flex space-x-4'>
                            <div className='flex-1 mr-2 text-lg text-black font-medium'>{problem?.title}</div>
                        </div>
                        {!loading && dbProblem && (
                            <div className='flex items-center mt-3'>
                                <div
                                    className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                                >
                                    {dbProblem.difficulty}
                                </div>
                                {solved && (
                                    <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                        <BsCheck2Circle />
                                    </div>
                                )}
                                <div
                                    className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                    onClick={handleLike}
                                >
                                    {liked ? <AiFillLike className='text-dark-blue-s' /> : <AiFillLike />}
                                    {/* <span className='text-xs'>{problem.likes}</span> */}
                                </div>
                                {/* <div
                                    className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
                                    onClick={handleDislike}
                                >
                                    {disliked ? <AiFillDislike className='text-dark-blue-s' /> : <AiFillDislike />}
                                    <span className='text-xs'>{problem.dislikes}</span>
                                </div> */}
                                <div
                                    className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
                                    onClick={handleStar}
                                >
                                    {starred ? <AiFillStar className='text-dark-yellow' /> : <TiStarOutline />}
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className='mt-3 flex space-x-2'>
                                {/* Add loading skeletons here */}
                            </div>
                        )}

                        {/* Problem Statement(paragraphs) */}
                        <div className='text-black text-sm'>
                            <div dangerouslySetInnerHTML={{ __html: problem?.problemStatement || '' }} />
                        </div>

                        {/* Examples */}
                        <div className='mt-4'>
                            {problem?.examples.map((example, index) => (
                                <div key={example.id}>
                                    <p className='font-medium text-black '>Example {index + 1}: </p>
                                    {example.img && <img src={example.img} alt='' className='mt-3' />}
                                    <div className='example-card'>
                                        <pre>
                                            <strong className='text-black'>Input: </strong> {example.inputText}
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
                            <div className='text-black text-sm font-medium'>Constraints:</div>
                            <ul className='text-black ml-5 list-disc '>
                                <div dangerouslySetInnerHTML={{ __html: problem?.constraints || '' }} />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description

function useGetCurrentProblem(idTitle: string) {
	const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");

	useEffect(() => {
		// Get problem from DB
		const fetchProblemByIdTitle = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/problem/${idTitle}`);
                const problem = await response.json();
                // console.log("Page Description fetchProblemByIdTitle problem: ", problem);
                setCurrentProblem(problem);
                setProblemDifficultyClass(
                    problem.difficulty === "Easy"
                        ? "bg-olive text-olive"
                        : problem.difficulty === "Medium"
                        ? "bg-dark-yellow text-dark-yellow"
                        : "bg-dark-pink text-dark-pink"
                );
                
            } catch (error) {
                console.error("Error fetching problem:", error);
            }
            setLoading(false);
        };
        fetchProblemByIdTitle();
        // console.log("Page Description useGetCurrentProblem idTitle: ", idTitle);
	}, [idTitle]);

	return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUsersDataOnProblem(idTitle: string) {
    const { data: session } = useSession();
    const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false });

    useEffect(() => {
        const getUsersDataOnProblem = async () => {
            if (session?.user.id) {
                try {
                    const response = await fetch(`/api/problem/${idTitle}/${session?.user.id}`, {
                        method: "GET",
                        // params: { email: session.user.email, problemId }
                    });
                    const data = await response.json();
                    // console.log("Page Description useGetUsersDataOnProblem data: ", data);

                    setData(data);
                } catch (error) {
                    console.error("Error fetching user's problem data:", error);
                }
            }
        };

        if (session?.user.username) getUsersDataOnProblem();
    }, [idTitle, session]);

    return { ...data, setData };
}