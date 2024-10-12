import React, { useState, useEffect } from 'react';
import { FiClock, FiX, FiPause, FiPlay, FiRefreshCw } from 'react-icons/fi';
import Timer from './Timer';
import Language from './Language';
type Props = {}

const PlaygroundHeader = (props: Props) => {


    return (
        <div className="flex items-center justify-between">
            {/* <Language/>
            <Timer/> */}
        </div>
    );
}

export default PlaygroundHeader