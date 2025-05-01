// ProductCard.tsx
"use client";
import { useDrag } from "react-dnd";
import React from "react";

export type Product = {
  id: string;
  productName: string;
  productType: "Main" | "Extra";
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [, dragRef] = useDrag(() => ({
    type: product.productType,
    item: product,
  }), [product]);

  return (
    <div
    //   ref={dragRef}
      ref={(node) => {
        if (node) dragRef(node);
      }}
      className="p-2 m-2 bg-white border rounded shadow cursor-pointer hover:bg-gray-50"
    >
      {product.productName}
    </div>
  );
};
