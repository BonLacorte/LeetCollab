import React from 'react';
import { BsChevronUp } from 'react-icons/bs';
import { Button } from '../ui/button';

type PlaygroundFooterProps = {
    handleSubmit: () => void;
    handleRun: () => void;
};

const PlaygroundFooter = ({ handleSubmit, handleRun }: PlaygroundFooterProps) => {
    return (
        // <div className=' border-green-500'>
            // <div className='flex mx-5 my-[10px] flex justify-between w-full'>
                <div className='flex flex-nowrap justify-center items-center space-x-4'>
                    {/* <button className='px-3 py-1.5 font-medium items-center transition-all inline-flex bg-gray-100 hover:bg-gray-200 text-sm text-dark-label-2 rounded-lg pl-3 pr-2'>
                        Console
                        <div className='ml-1 transform transition flex items-center'>
                            <BsChevronUp className='fill-gray-6 mx-1 fill-dark-gray-6' />
                        </div>
                    </button> */}
                    <div>
                        <Button className='bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50' onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                    <div>
                        <Button className='bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50' onClick={handleRun}>
                            Run
                        </Button>
                    </div>
                </div>
            // </div>
        // </div>
    )
}

export default PlaygroundFooter