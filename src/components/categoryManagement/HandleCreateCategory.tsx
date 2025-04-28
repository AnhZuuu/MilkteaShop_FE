"use client";
import React, { useState } from "react";

export interface CreateCategoryPayload {
  categoryName: string;
  description: string;
  createdBy: string;
}

interface HandleCreateCategoryProps {
  onClose: () => void;
  userInfo: any;
  onCategoryCreated: (newCategory: any) => void;
}

const HandleCreateCategory: React.FC<HandleCreateCategoryProps> = ({
  onClose,
  userInfo,
  onCategoryCreated,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim() || !description.trim()) return;

    const newCategory: CreateCategoryPayload = {
      categoryName,
      description,
      createdBy: userInfo?.userId || "unknown",
    };

    // try {
    //   const res = await fetch(
    //     "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         // Authorization: `Bearer ${userInfo?.token}`,
    //       },
    //       body: JSON.stringify(newCategory),
    //     }
    //   );

    //   if (!res.ok) throw new Error("Lỗi tạo category");

    //   const created = await res.json();
    //   onCategoryCreated(created); // Notify parent about the new category
    //   console.log("Created category:", created);
    // } catch (error) {
    //   console.error("Lỗi xảy ra trong khi tạo category:", error);
    // } finally {
    //   onClose();
    //   setCategoryName("");
    //   setDescription("");
    // }
    try {
      const res = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          body: JSON.stringify(newCategory),
        }
      );
    
      if (!res.ok) {
        console.error("Server returned:", res.status);
        throw new Error("Lỗi tạo category");
      }
    
      let created = null;
      const contentType = res.headers.get("content-type");
    
      if (contentType && contentType.includes("application/json")) {
        created = await res.json();
      } else {
        console.warn("Không có nội dung JSON trả về.");
      }
    
      if (!created) {
        const newCategory = {
          id: crypto.randomUUID(), 
          categoryName,
          description,
          products: [],
          categoryExtraMappings: [],
          isActive: true, 
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          createdBy: userInfo?.userId || "unknown",
          updatedBy: null,
        };
      
        onCategoryCreated(newCategory); 
      } else {
        const newCategory = {
          id: crypto.randomUUID(),
          categoryName,
          description,
          products: [],
          categoryExtraMappings: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          createdBy: userInfo?.userId || "unknown",
          updatedBy: null,
        };
        onCategoryCreated(newCategory);
      }
      
    } catch (error) {
      console.error("Lỗi xảy ra trong khi tạo category:", error); 
    } finally {
      onClose();
      setCategoryName("");
      setDescription("");
    }
    
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Tạo mới phân loại sản phẩm
          </h3>
          <p className="text-gray-600 text-sm">
            Nhập thông tin chi tiết để tạo một phân loại sản phẩm mới.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="categoryName"
                className="text-sm font-bold text-gray-700"
              >
                Tên loại sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="categoryName"
                placeholder="Ví dụ: Trà sữa"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="text-sm font-bold text-gray-700"
              >
                Mô tả
              </label>
              <input
                type="text"
                id="description"
                placeholder="Ví dụ: Các loại trà sữa nguyên lá"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
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

export default HandleCreateCategory;
