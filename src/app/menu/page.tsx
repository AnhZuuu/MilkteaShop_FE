"use client";
import CartPanel from "@/components/menu/CartPanel";
import ProductGrid from "@/components/menu/ProductGrid";
import Sidebar from "@/components/menu/Sidebar";
import OrderSummary from "@/components/order/OrderSummary";
import React, { useEffect, useState } from "react";

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [productSize, setProductSize] = useState<ProductSize[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product"
        );
        const data = await res.json();
        setProducts(
          data.filter((p: Product) => p.isActive && p.productType !== "Extra")
        );
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    const fetchProductSize = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize"
        );
        const data = await res.json();
        setProductSize(data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProducts();
    fetchProductSize();
  }, []);

  const handleAddToCart = (item: OrderItem) => {
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div
        className={`transition-all duration-300 ${
          cart.length ? "w-[70%]" : "w-[85%]"
        } p-4 overflow-y-auto scrollbar-hidden`}
      >
        <ProductGrid
          category={selectedCategory}
          products={products}
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart}
        />
      </div>

      {cart.length ? (
        <>
          {!isCheckout ? (
            <CartPanel
              cart={cart}
              productSizes={productSize}
              products={products}
              onRemove={(index) => {
                const newCart = [...cart];
                newCart.splice(index, 1);
                setCart(newCart);
              }}
              isCheckout={isCheckout}
              setIsCheckout={setIsCheckout}
            />
          ) : (
            // <OrderSummary cart={cart} onConfirmOrder={handleConfirmOrder} />
            <OrderSummary
              cart={cart}
              onConfirmOrder={handleConfirmOrder}
              setIsCheckout={setIsCheckout}
              products={products}
              productSizes={productSize}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MenuPage;
