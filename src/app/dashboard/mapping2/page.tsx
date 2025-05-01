"use client";

import React, { useState, useEffect } from "react";
import {
  DndProvider,
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaGripVertical, FaCheck, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Types
interface Product {
  id: number;
  productName: string;
  price: number;
  productType: "Main" | "Extra";
}

interface MappedProducts {
  main: Product | null;
  extra: Product | null;
}

type DragItem = {
  id: number;
  type: "main" | "extra";
};

// ProductCard Component
const ProductCard: React.FC<{ product: Product; type: "main" | "extra" }> = ({ product, type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id: product.id, type },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        if (node) drag(node);
      }}
      className={`p-4 rounded-lg shadow-md mb-4 cursor-move transition-all flex items-center justify-between 
        border-2 hover:shadow-lg 
        ${isDragging ? "opacity-50" : "opacity-100"} 
        ${type === "main" ? "bg-blue-100 border-blue-300" : "bg-green-100 border-green-300"}`}
    >
      <div className="flex items-center space-x-3">
        <FaGripVertical className="text-gray-500" />
        <span className="font-medium">{product.productName}</span>
      </div>
      <span className={`text-sm ${type === "main" ? "text-blue-600" : "text-green-600"}`}>
        ${product.price}
      </span>
    </div>
  );
};

// MappingSection Component
const MappingSection: React.FC<{
  onDrop: (item: DragItem) => void;
  mappedProducts: MappedProducts;
}> = ({ onDrop, mappedProducts }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["main", "extra"],
    drop: (item: DragItem) => onDrop(item),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        if (node) drop(node);
      }}
      className={`p-6 rounded-lg border-2 border-dashed transition-all 
        ${isOver ? "bg-gray-100 border-gray-400" : "bg-gray-50 border-gray-200"} 
        min-h-[200px]`}
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Kéo và Thả</h2>
      {mappedProducts.main && mappedProducts.extra ? (
        <div className="flex items-center justify-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <p>{mappedProducts.main.productName}</p>
          </div>
          <FaCheck className="text-green-500 text-xl" />
          <div className="bg-green-100 p-3 rounded-lg">
            <p>{mappedProducts.extra.productName}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Kéo thả để gắn món chính và topping với nhau
        </p>
      )}
    </div>
  );
};

// Main Component
const ProductMapping: React.FC = () => {
  const [mainProducts, setMainProducts] = useState<Product[]>([]);
  const [extraProducts, setExtraProducts] = useState<Product[]>([]);
  const [mappedProducts, setMappedProducts] = useState<MappedProducts>({
    main: null,
    extra: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product"); // Replace with real API
        const data: Product[] = await res.json();

        const main = data.filter((p) => p.productType === "Main");
        const extra = data.filter((p) => p.productType === "Extra");

        setMainProducts(main);
        setExtraProducts(extra);
      } catch (error) {
        toast.error("Failed to fetch products");
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleDrop = (item: DragItem) => {
    const { id, type } = item;
    const product =
      type === "main"
        ? mainProducts.find((p) => p.id === id)
        : extraProducts.find((p) => p.id === id);

    if (!product) return;

    if (mappedProducts[type]) {
      toast.warning("A product of this type is already mapped!");
      return;
    }

    setMappedProducts((prev) => ({ ...prev, [type]: product }));
    toast.success("Product mapped successfully!");
  };

  const handleReset = () => {
    setMappedProducts({ main: null, extra: null });
    toast.info("Mapping cleared!");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Gắn topping với món chính</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Products */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Món chính</h2>
            {mainProducts.map((product) => (
              <ProductCard key={product.id} product={product} type="main" />
            ))}
          </div>

          {/* Mapping Section */}
          <MappingSection onDrop={handleDrop} mappedProducts={mappedProducts} />

          {/* Extra Products */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Topping</h2>
            {extraProducts.map((product) => (
              <ProductCard key={product.id} product={product} type="extra" />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <FaTimes />
            <span>Xóa làm lại</span>
          </button>
        </div>

        <ToastContainer position="bottom-right" />
      </div>
    </DndProvider>
  );
};

export default ProductMapping;
