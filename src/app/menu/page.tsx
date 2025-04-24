// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/menu/Sidebar";
import ProductGrid from "@/components/menu/ProductGrid";
import CartPanel from "@/components/menu/CartPanel";

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

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   category: string;
//   note?: string;
// }

// const sampleProducts: Product[] = [
//   { id: 1, name: 'Hoa quả sơn', price: 20000, image: '/fruit.jpg', category: 'an-vat' },
//   { id: 2, name: 'Khô bò', price: 31000, image: '/beef.jpg', category: 'an-vat' },
//   { id: 3, name: 'Khô gà', price: 26000, image: '/chicken.jpg', category: 'an-vat' },
//   { id: 4, name: 'Snack tôm cay', price: 10000, image: '/snack.jpg', category: 'an-vat' },
//   { id: 5, name: 'Coca Cola', price: 12000, image: '/coke.jpg', category: 'nuoc-uong' },
//   { id: 6, name: 'Pepsi', price: 12000, image: '/pepsi.jpg', category: 'nuoc-uong' },
// ];

const MenuPage = () => {
  interface CartItem extends Product {
    // note: string;
  }
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("https://6801a85581c7e9fbcc430ea1.mockapi.io/swp391/Products"); // Replace with your API URL
        const data = await response.json();
        setProducts(data.filter((p : any) => p.ProductType !== "Extra"));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    // setCart((prev) => [...prev, { ...product, note: "" }]);
    setCart((prev) => [...prev, { ...product }]);

  };

  // const handleNoteChange = (index: number, note: string) => {
  //   setCart((prev) => {
  //     const updated = [...prev];
  //     updated[index].note = note;
  //     return updated;
  //   });
  // };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };
  

  return (
    <div className="flex h-screen bg-blue-200 text-white">
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div
        className={`transition-all duration-300 ${
          cart.length ? "w-[65%]" : "w-[85%]"
        } p-4 overflow-y-auto`}
      >
        <ProductGrid
          category={selectedCategory}
          products={products}
          onAddToCart={handleAddToCart}
        />
      </div>
      {cart.length > 0 && (
        <div className="w-[20%] bg-gray-800 p-4 overflow-y-auto">
          <CartPanel
            cart={cart}
            // onNoteChange={handleNoteChange}
            onRemove={handleRemoveFromCart}
          />
        </div>
      )}
    </div>
  );
};

export default MenuPage;
