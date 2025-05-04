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
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
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
    //   updatedAt: new Date(), // optional
    //   updatedBy: userInfo?.userId || "unknown", // optional
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

      if (!res.ok) throw new Error("Lỗi khi cập nhật sản phẩm");

      onProductUpdated(updatedProduct);
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Cập nhật sản phẩm
          </h3>
          <p className="text-gray-600 text-sm">
            Thay đổi thông tin sản phẩm đã chọn.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input label="Tên sản phẩm" value={productName} onChange={setProductName} required />
            <Input label="Mô tả" value={description} onChange={setDescription} />
            <Input label="Image URL" value={imageUrl} onChange={setImageUrl} />
            <Input label="Loại sản phẩm" value={productType} onChange={setProductType} />

            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm font-bold text-gray-700">
                Phân loại <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chọn phân loại --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
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
  <div className="flex flex-col">
    <label className="text-sm font-bold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default HandleUpdateProduct;
