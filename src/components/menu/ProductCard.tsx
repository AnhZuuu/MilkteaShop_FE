import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-[#1c2c4a] p-4 rounded shadow-lg">
      <img src={product.image} alt={product.name} className="h-24 w-full object-cover rounded" />
      <h3 className="text-lg mt-2 font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-400">{product.price.toLocaleString()} đ</p>
      <button
        className="mt-2 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 w-full"
        onClick={() => onAddToCart(product)}
      >
        +
      </button>
    </div>
  );
};

export default ProductCard;
