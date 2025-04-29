import React from "react";
import ProductCard from "./ProductCard";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   category: string;
// }
interface Product {
  id: string;
  productName: string;
  description: string;
  categoryId: string;
  category: any;
  imageUrl: string;
  productType: string | null;
  productSizes: any[];
  price: number;
  isActive: boolean;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  toppings: Product[];
}

interface ProductGridProps {
  category: string;
  products: Product[];
  onAddToCart: (item: CartItem) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category, products, onAddToCart }) => {
  const filtered = category === "all" ? products : products.filter(p => p.categoryId === category);

  return (
    <div className="grid grid-cols-3 gap-4">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;