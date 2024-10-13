'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import binaryTree1 from '@/lib/problems/images/binary-tree-1.jpg';
import binaryTree2 from '@/lib/problems/images/binary-tree-2.jpg';
import containerWithMostWater from '@/lib/problems/images/container-with-most-water-1.jpg';

const adImages = [
    binaryTree1,
    binaryTree2,
    containerWithMostWater,
    // Add more image paths as needed
];

const FloatingAd = () => {
    const [selectedImage, setSelectedImage] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsVisible(true);
        const randomImage = adImages[Math.floor(Math.random() * adImages.length)];
        setSelectedImage(randomImage);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="relative">
                <Image
                    src={selectedImage}
                    alt="Advertisement"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-lg"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Ads by Bon
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full hover:bg-opacity-75 transition-colors"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default FloatingAd;