import React from "react";

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
  CreatedAt: number;         // Timestamp for when the product was created
  UpdatedAt: number;         // Timestamp for when the product was updated
  DeletedAt: number;         // Timestamp for when the product was deleted
  CreatedBy: string;         // Creator of the product
  UpdatedBy: string;         // User who last updated the product
  Id: string;                // Unique ID of the product
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-[#1c2c4a] p-4 rounded shadow-lg">
      <img src={product.ImageUrl} alt={product.ImageUrl} className="h-50 w-full object-cover rounded" />
      <h3 className="text-lg mt-2 font-semibold">{product.ProductName}</h3>
      <h4 className="text-md text-gray-300">{product.Description}</h4>
      <p className="text-sm text-gray-400">{product.Price.toLocaleString()} đ</p>
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
