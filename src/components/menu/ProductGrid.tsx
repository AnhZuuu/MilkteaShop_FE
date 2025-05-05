import React from "react";
import ProductCard from "./ProductCard";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   category: string;
// }
// interface Product {
//   id: string;
//   productName: string;
//   description: string;
//   categoryId: string;
//   category: any;
//   imageUrl: string;
//   productType: string | null;
//   productSizes: any[];
//   price: number;
//   isActive: boolean;
// }

// interface CartItem extends Product {
//   quantity: number;
//   selectedSize: string;
//   toppings: Product[];
// }

interface ProductGridProps {
  category: string;
  products: Product[];
  searchQuery: string;
  onAddToCart: (item: OrderItem) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category, products, searchQuery, onAddToCart }) => { 
  const filtered = products.filter((p) => {
    const matchesCategory = category === "all" || p.categoryId === category;
    const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;