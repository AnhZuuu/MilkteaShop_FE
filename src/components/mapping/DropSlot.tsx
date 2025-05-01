// DropSlot.tsx
"use client";
import React from "react";
import { useDrop } from "react-dnd";
import { Product } from "./ProductCard";

interface DropSlotProps {
  acceptType: "Main" | "Extra";
  currentItem: Product | null;
  onDrop: (item: Product) => void;
}

export const DropSlot: React.FC<DropSlotProps> = ({ acceptType, currentItem, onDrop }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: acceptType,
    drop: (item: Product) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [acceptType, onDrop]);

  return (
    <div
    //   ref={dropRef}
      ref={(node) => {
        if (node) dropRef(node);
      }}
      className={`h-20 border-2 p-3 rounded flex items-center justify-center transition-colors duration-150 ${
        isOver ? "bg-green-100 border-green-500" : "bg-gray-100 border-dashed"
      }`}
    >
      {currentItem ? currentItem.productName : `Kéo ${acceptType} vào đây`}
    </div>
  );
};