import React from 'react';
import { BsChevronUp } from 'react-icons/bs';

type PlaygroundFooterProps = {
    handleSubmit: () => void;
};

const PlaygroundFooter = ({ handleSubmit }: PlaygroundFooterProps) => {
    return (
        <div className='flex border border-red-500 absolute bottom-0 z-10 w-full'>
            <div className='mx-5 my-[10px] flex justify-between w-full'>
                <div className='mr-2 flex flex-1 flex-nowrap items-center space-x-4'>
                    <button className='px-3 py-1.5 font-medium items-center transition-all inline-flex bg-gray-100 hover:bg-gray-200 text-sm text-dark-label-2 rounded-lg pl-3 pr-2'>
                        Console
                        <div className='ml-1 transform transition flex items-center'>
                            <BsChevronUp className='fill-gray-6 mx-1 fill-dark-gray-6' />
                        </div>
                    </button>
                    <button className='px-3 py-1.5 font-medium items-center transition-all inline-flex bg-gray-100 hover:bg-gray-200 text-sm text-dark-label-2 rounded-lg pl-3 pr-2' onClick={handleSubmit}>
                        Run
                    </button>
                    <button className='px-3 py-1.5 font-medium items-center transition-all inline-flex bg-gray-100 hover:bg-gray-200 text-sm text-dark-label-2 rounded-lg pl-3 pr-2' onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                <div className='flex items-center space-x-4'>
                    <button className='px-3 py-1.5 font-medium items-center transition-all inline-flex bg-gray-100 hover:bg-gray-200 text-sm text-dark-label-2 rounded-lg pl-3 pr-2' onClick={handleSubmit}>
                        Run
                    </button>
                    <button className='px-3 py-1.5 font-medium items-center transition-all inline-flex bg-gray-100 hover:bg-gray-200 text-sm text-dark-label-2 rounded-lg pl-3 pr-2' onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlaygroundFooter