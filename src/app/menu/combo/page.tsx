"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ComboGrid from "@/components/menu/combo/ComboGrid";
import ComboCartPanel from "@/components/menu/combo/ComboCartPanel";
import ComboOrderSummary from "@/components/menu/combo/ComboOrderSummary";
import Sidebar from "@/components/menu/Sidebar";

const ComboPage: React.FC = () => {
  const [comboItems, setComboItems] = useState<ComboItem[]>([]);
  const [cart, setCart] = useState<ComboItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<string>('3a134d3d-2833-4b6e-88f4-08dd8abc31e4');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/");
    } else {
      setUser(JSON.parse(userData).id);
      console.log("ALOOOOOOOOO"+ userData)
      setLoading(false);
    }
    console.log("USERRRRRRRRRR: "+user )

    const fetchCombos = async () => {
      try {
        const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ComboItem");
        const data = await res.json();
        setComboItems(data);
      } catch (err) {
        console.error("Failed to load combos", err);
      }
    };

    fetchCombos();
  }, []);

  const handleAddToCart = (item: ComboItem) => {
    setCart((prev) => [...prev, item]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmComboOrder = async (orderData: any) => {
    try {
      const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/create-combo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      console.log("Order placed:", result);
      setCart([]);
      setIsCheckout(false);
    } catch (err) {
      console.error("Failed to submit combo order:", err);
    }
  };

  return (
    <div className="flex h-screen bg-blue-200 text-white">
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className={`transition-all duration-300 ${cart.length ? "w-[70%]" : "w-[85%]"} p-4 overflow-y-auto`}>
        <ComboGrid
          combos={comboItems}
          onAddToCart={handleAddToCart}
        />
      </div>
      {cart.length > 0 &&
        (!isCheckout ? (
          <ComboCartPanel
            cart={cart}
            onRemove={handleRemoveFromCart}
            isCheckout={isCheckout}
            setIsCheckout={setIsCheckout}
          />
        ) : (
          <ComboOrderSummary
            cart={cart}
            userId={user}
            onConfirmOrder={handleConfirmComboOrder}
            setIsCheckout={setIsCheckout}
          />
        ))}
    </div>
  );
};

export default ComboPage;
