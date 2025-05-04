'use client';

import React from 'react';
import { DropSlot } from './DropSlot';
import { Product } from './ProductCard';

interface MappingAreaProps {
    main: Product | null;
    extra: Product | null;
    setMain: (p: Product | null) => void;
    setExtra: (p: Product | null) => void;
}

export const MappingArea: React.FC<MappingAreaProps> = ({ main, extra, setMain, setExtra }) => {
    const handleReset = () => {
        setMain(null);
        setExtra(null);
    };

    return (
        <div className="p-4 bg-white rounded shadow-md border space-y-4">
            <h2 className="text-xl font-bold mb-2">Kéo và thả</h2>
            <DropSlot acceptType="Main" onDrop={setMain} currentItem={main} />
            <DropSlot acceptType="Extra" onDrop={setExtra} currentItem={extra} />

            {/* Reset Button */}
            <button
                onClick={handleReset}
                className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
                Làm lại
            </button>
        </div>
    );
};
