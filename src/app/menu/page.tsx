"use client";
import CartPanel from "@/components/menu/CartPanel";
import ProductCard from "@/components/menu/ProductCard";
import ProductGrid from "@/components/menu/ProductGrid";
import Sidebar from "@/components/menu/Sidebar";
import OrderSummary from "@/components/order/OrderSummary";
import React, { useState } from "react";

// You can move these types to separate files
interface Product {
  id: string;
  productName: string;
  description: string;
  categoryId: string;
  category: any;
  imageUrl: string;
  productType: string | null;
  productSizes: any[];
  isActive: boolean;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  toppings: Product[];
  note?: string;
}

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false); // Track if checkout is active

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://6801a85581c7e9fbcc430ea1.mockapi.io/swp391/Products"
      );
      const data = await res.json();
      setProducts(
        data.filter((p: Product) => p.isActive && p.productType !== "Extra")
      );
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmOrder = (orderDetails: any) => {
    console.log("Order confirmed:", orderDetails);
    // You would send the order to the backend or handle it as per your flow
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
      {!isCheckout ? (
        // <CartPanel cart={cart} onRemove={handleRemoveFromCart} />
        <CartPanel
        cart={cart}
        onRemove={(index) => {
          const newCart = [...cart];
          newCart.splice(index, 1);
          setCart(newCart);
        }}
        isCheckout={isCheckout}
        setIsCheckout={setIsCheckout} // ✅ Pass setter
      />
      ) : (
        <OrderSummary cart={cart} onConfirmOrder={handleConfirmOrder} />
      )}     
    </div>
  );
};

export default MenuPage;
