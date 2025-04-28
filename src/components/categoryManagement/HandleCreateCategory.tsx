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

      if (!res.ok) throw new Error("Lỗi tạo category");

      const created = await res.json();
      onCategoryCreated(created); // Notify parent about the new category
      onClose(); // Close the modal after creation
      setCategoryName(""); // Clear input fields
      setDescription("");
    } catch (error) {
      console.error("Lỗi xảy ra trong khi tạo category:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full space-y-6">
        <div className="mb-6 bg-gray-100  rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-center">Tạo mới loại sản phẩm</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Tên loại sản phẩm"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                />
              </div>
              <div className="mt-6 flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={onClose} // This will close the modal
                  className="px-6 py-3 w-1/3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 w-1/3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Tạo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HandleCreateCategory;
