"use client";
import React, { useEffect, useState } from "react";

export interface Product {
  id: string;
  productName: string;
  description: string;
  categoryId: string;
  category: any;
  imageUrl: string | null;
  productType: string | null;
  productSizes: any[];
  isActive: boolean;
}

export interface Category {
  id: string;
  categoryName: string;
}

interface HandleUpdateProductProps {
  product: Product;
  onClose: () => void;
  userInfo: any;
  onProductUpdated: (updatedProduct: Product) => void;
}

const HandleUpdateProduct: React.FC<HandleUpdateProductProps> = ({
  product,
  onClose,
  userInfo,
  onProductUpdated,
}) => {
  const [productName, setProductName] = useState(product.productName);
  const [description, setDescription] = useState(product.description);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [productType, setProductType] = useState(product.productType || "");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category", {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !description.trim() || !categoryId) return;

    const updatedProduct: Product = {
      ...product,
      productName,
      description,
      categoryId,
      imageUrl,
      productType,
    };

    try {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      onProductUpdated(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg space-y-6">
        <h3 className="text-xl font-bold">Cập nhật sản phẩm</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tên sản phẩm" value={productName} onChange={setProductName} required />
          <Input label="Mô tả" value={description} onChange={setDescription} />
          <Input label="Image URL" value={imageUrl} onChange={setImageUrl} />
          <Input label="Loại sản phẩm" value={productType} onChange={setProductType} />

          <div>
            <label className="block font-semibold text-sm mb-1">Phân loại</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border p-2 rounded-md"
            >
              <option value="">-- Chọn phân loại --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) => (
  <div>
    <label className="block font-semibold text-sm mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded-md"
    />
  </div>
);

export default HandleUpdateProduct;
