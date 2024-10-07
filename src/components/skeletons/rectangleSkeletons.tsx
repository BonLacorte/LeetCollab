import React from 'react'

type Props = {}

const rectangleSkeletons = (props: Props) => {
    return (
        <div className='space-y-2.5 animate-pulse'>
            <div className='flex items-center justify-between space-x-2'>
                <div>
                    <div className='h-6 w-6 rounded-full bg-gray-200'></div>
                </div>
            </div>
        </div>
    )
}

export default rectangleSkeletons