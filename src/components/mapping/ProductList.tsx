// ProductList.tsx
import React from "react";
import { ProductCard, Product } from "./ProductCard";

export const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {["Main", "Extra"].map((type) => (
        <div key={type}>
          <h2 className="text-xl font-semibold mb-2">{type}</h2>
          <div className="space-y-2">
            {products
              .filter((p) => p.productType === type)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};