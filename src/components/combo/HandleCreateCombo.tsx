"use client";
import React, { useEffect, useState } from "react";

interface ProductSize {
  id: string;
  quantity: number;
  size: number;
  price: number;
}

interface Product {
  productId: string;
  productName: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
  productType: string;
  productSizes: ProductSize[];
}

interface ComboItem {
  id: string;
  comboCode: string;
  description: string;
  price: number;
  products: {
    productId: string;
    productName: string;
    description: string;
    categoryId: string;
    imageUrl: string;
    isActive: boolean;
    productType: string;
    productSize: ProductSize;
  }[];
}

interface HandleCreateComboProps {
  onClose: () => void;
  onComboCreated: (combo: ComboItem) => void;
}

const HandleCreateCombo: React.FC<HandleCreateComboProps> = ({
  onClose,
  onComboCreated,
}) => {
  const [comboCode, setComboCode] = useState("");
  const [description, setDescription] = useState("");
  const [comboPrice, setComboPrice] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductSizesMap, setSelectedProductSizesMap] = useState<{
    [productId: string]: string[];
  }>({});

  const sizeLabel = (size: number): string => {
    switch (size) {
      case 0:
        return "S";
      case 1:
        return "M";
      case 2:
        return "L";
      case -1:
        return "Topping";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product"
      );
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const toggleProductSelection = (productId: string, sizeId: string) => {
    setSelectedProductSizesMap((prev) => {
      const updatedSizes = prev[productId] ? [...prev[productId]] : [];
      const index = updatedSizes.indexOf(sizeId);
      if (index !== -1) {
        updatedSizes.splice(index, 1);
      } else {
        updatedSizes.push(sizeId);
      }
      return {
        ...prev,
        [productId]: updatedSizes,
      };
    });
  };

  const handleSubmit = async () => {
    const selectedProducts = products.flatMap((p) => {
      const selectedSizeIds = selectedProductSizesMap[p.productId];
      if (!selectedSizeIds || selectedSizeIds.length === 0) return [];

      return selectedSizeIds.map((sizeId) => {
        const size = p.productSizes.find((s) => s.id === sizeId);
        if (!size) return null;

        return {
          productId: p.productId,
          productName: p.productName,
          description: p.description,
          categoryId: p.categoryId,
          imageUrl: p.imageUrl,
          isActive: p.isActive,
          productType: p.productType,
          productSize: size,
        };
      }).filter(Boolean); // Remove nulls
    });

    const newCombo = {
      comboCode,
      description,
      price: comboPrice,
      products: selectedProducts,
    };

    try {
      const res = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ComboItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCombo),
        }
      );

      if (!res.ok) throw new Error("Failed to create combo");

      const text = await res.text();
      const createdCombo = text ? JSON.parse(text) : newCombo;

      onComboCreated(createdCombo);
      onClose();
    } catch (error) {
      console.error("Error creating combo:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl space-y-4">
        <h2 className="text-xl font-bold">Tạo Combo mới</h2>

        <div>
          <label className="block font-medium">Mã Combo</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={comboCode}
            onChange={(e) => setComboCode(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Mô tả</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Chọn sản phẩm</label>
          <div className="max-h-40 overflow-y-auto border p-2 rounded space-y-2">
            {products.map((product) => (
              <div key={product.productId}>
                <div className="font-semibold">{product.productName}</div>
                {product.productSizes && product.productSizes.length > 0 ? (
                  product.productSizes.map((size) => (
                    <div
                      key={size.id}
                      className="flex items-center space-x-2 ml-4"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedProductSizesMap[product.productId]?.includes(
                            size.id
                          ) || false
                        }
                        onChange={() =>
                          toggleProductSelection(product.productId, size.id)
                        }
                      />
                      <span>
                        {sizeLabel(size.size)} -{" "}
                        {size.price.toLocaleString()}đ
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="ml-4 text-sm text-gray-500">
                    (Không có size)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium">Giá combo</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={comboPrice}
            onChange={(e) => setComboPrice(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tạo Combo
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandleCreateCombo;
