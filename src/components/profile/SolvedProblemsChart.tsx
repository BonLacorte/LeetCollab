import React from 'react';

interface SolvedProblemsChartProps {
    easySolved: number;
    easyTotal: number;
    mediumSolved: number;
    mediumTotal: number;
    hardSolved: number;
    hardTotal: number;
}

const SolvedProblemsChart: React.FC<SolvedProblemsChartProps> = ({
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
}) => {
    const totalSolved = easySolved + mediumSolved + hardSolved;
    const totalProblems = easyTotal + mediumTotal + hardTotal;

    const calculatePercentage = (solved: number, total: number) => {
        return (solved / total) * 100;
    };

    const easyPercentage = calculatePercentage(easySolved, easyTotal);
    const mediumPercentage = calculatePercentage(mediumSolved, mediumTotal);
    const hardPercentage = calculatePercentage(hardSolved, hardTotal);

    return (
        // <div className='flex flex-col md:flex-row bg-white rounded-lg'>
            // <div className='md:w-1/2 flex flex-row'> 
            <div>
                {/* <div> */}
                    <div className="relative w-full h-48 ">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                            <path
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e6e6e6"
                            strokeWidth="2"
                            />
                            <path
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#ffa116"
                            strokeWidth="2"
                            strokeDasharray={`${easyPercentage}, 100`}
                            />
                            <path
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#ffc01e"
                            strokeWidth="2"
                            strokeDasharray={`${mediumPercentage}, 100`}
                            strokeDashoffset={-easyPercentage}
                            />
                            <path
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#ff375f"
                            strokeWidth="2"
                            strokeDasharray={`${hardPercentage}, 100`}
                            strokeDashoffset={-(easyPercentage + mediumPercentage)}
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-3xl font-bold">{totalSolved}</div>
                            <div className="text-sm">Solved</div>
                        </div>
                        {/* <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs">
                            <div>
                            <div className="font-semibold">Easy</div>
                            <div>{easySolved}/{easyTotal}</div>
                            </div>
                            <div>
                            <div className="font-semibold">Medium</div>
                            <div>{mediumSolved}/{mediumTotal}</div>
                            </div>
                            <div>
                            <div className="font-semibold">Hard</div>
                            <div>{hardSolved}/{hardTotal}</div>
                            </div>
                        </div> */}
                    </div>
                    <div className="flex flex-row justify-between text-xs">
                        <div>
                        <div className="font-semibold">Easy</div>
                        <div>{easySolved}/{easyTotal}</div>
                        </div>
                        <div>
                        <div className="font-semibold">Medium</div>
                        <div>{mediumSolved}/{mediumTotal}</div>
                        </div>
                        <div>
                        <div className="font-semibold">Hard</div>
                        <div>{hardSolved}/{hardTotal}</div>
                        </div>
                    </div>
                {/* </div>    */}
            </div>
            // <div className='md:w-1/2'>

            // </div>
        // </div>
    );
};

export default SolvedProblemsChart;