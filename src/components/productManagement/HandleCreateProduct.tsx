"use client";
import React, { useState, useEffect } from "react";

export interface CreateProductPayload {
  productName: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  // productType: "Main" | "Extra" | string;
}

interface HandleCreateProductProps {
  onClose: () => void;
  userInfo: any;
  onProductCreated: (newProduct: any) => void;
}

const HandleCreateProduct: React.FC<HandleCreateProductProps> = ({
  onClose,
  userInfo,
  onProductCreated,
}) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  // const [size, setSize] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category",
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [userInfo?.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !description.trim() || !imageUrl.trim() || !categoryId) return;
    // if (!productName.trim() || !description.trim() || !price || !imageUrl.trim() || !categoryId) return;
    // if (!productName.trim() || !description.trim() || !price || !size.trim() || !imageUrl.trim() || !categoryId) return;

    const newProduct: CreateProductPayload = {
      productName,
      description,
      // price: typeof price === "string" ? parseFloat(price) : price,
      imageUrl,
      // size,
      categoryId,
      // createdBy: userInfo?.userId || "unknown",
    };

    try {
      const res = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (!res.ok) {
        console.error("Server returned:", res.status);
        throw new Error("Lỗi tạo sản phẩm");
      }

      let created = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        created = await res.json();
      } else {
        console.warn("Không có nội dung JSON trả về.");
      }

      if (!created) {
        const fallbackProduct = {
          id: crypto.randomUUID(),
          ...newProduct,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          updatedBy: null,
        };
        onProductCreated(fallbackProduct);
      } else {
        onProductCreated(created);
      }
    } catch (error) {
      console.error("Lỗi xảy ra trong khi tạo sản phẩm:", error);
    } finally {
      onClose();
      setProductName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      // setSize("");
      setCategoryId("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Tạo mới sản phẩm
          </h3>
          <p className="text-gray-600 text-sm">
            Nhập thông tin chi tiết để tạo một sản phẩm mới.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="productName" className="text-sm font-bold text-gray-700">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ví dụ: Trà sữa matcha"
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-bold text-gray-700">
                Mô tả
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả sản phẩm"
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            
            <div className="flex flex-col">
              <label htmlFor="imageUrl" className="text-sm font-bold text-gray-700">
                Ảnh URL
              </label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Link hình ảnh sản phẩm"
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


            <div className="flex flex-col">
              <label htmlFor="categoryId" className="text-sm font-bold text-gray-700">
                Loại sản phẩm <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn loại sản phẩm</option>
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
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandleCreateProduct;
