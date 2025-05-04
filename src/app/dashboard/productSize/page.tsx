'use client'
import { useState } from "react";
import ProductSizeManage from "@/components/productSize/ProductSizeManagement";
import ExtraSizeManage from "@/components/productSize/ExtraSizeManagement";

export default function ProductSizePage() {
  const [activeTab, setActiveTab] = useState<"main" | "extra">("main");

  return (
    <div className="p-4">
      <div className="flex w-full mb-4">
        <button
          onClick={() => setActiveTab("main")}
          className={`w-1/2 py-3 text-center ${activeTab === "main" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Món chính
        </button>
        <button
          onClick={() => setActiveTab("extra")}
          className={`w-1/2 py-3 text-center ${activeTab === "extra" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Topping
        </button>
      </div>

      {activeTab === "main" ? <ProductSizeManage /> : <ExtraSizeManage />}
    </div>
  );
}
