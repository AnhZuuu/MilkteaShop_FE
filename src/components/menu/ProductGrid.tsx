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
  ProductName: string;       // Name of the product
  CategoryId: string;        // ID of the category the product belongs to
  Description: string;       // Description of the product
  ImageUrl: string;          // URL of the product's image
  Price: number;             // Price of the product
  Size: string[];            // Available sizes for the product
  IsActive: boolean;         // Status of the product (active/inactive)
  CreatedAt: Date;         // Timestamp for when the product was created
  UpdatedAt: Date;         // Timestamp for when the product was updated
  DeletedAt: Date;         // Timestamp for when the product was deleted
  CreatedBy: string;         // Creator of the product
  UpdatedBy: string;         // User who last updated the product
  Id: string;                // Unique ID of the product
}


interface ProductGridProps {
  category: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category, products, onAddToCart }) => {
  const filtered = category === "all" ? products : products.filter(p => p.CategoryId === category);

  return (
    <div className="grid grid-cols-3 gap-4">
      {filtered.map((product) => (
        <ProductCard key={product.Id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;