import React, { useState, useEffect } from "react";

interface HandleUpdateMappingProps {
  categories: any[]; // Pass the categories prop for dropdown
  mapping: any; // The current mapping being edited
  onClose: () => void; // Close handler
  onUpdated: () => void; // Callback after update
}

const HandleUpdateMapping: React.FC<HandleUpdateMappingProps> = ({
  categories,
  mapping,
  onClose,
  onUpdated,
}) => {
  const [mainCategoryId, setMainCategoryId] = useState(mapping.mainCategoryId);
  const [extraCategoryId, setExtraCategoryId] = useState(mapping.extraCategoryId);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/CategoryExtraMapping/${mapping.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mainCategoryId, extraCategoryId }),
        }
      );
      onUpdated(); 
      onClose(); 
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Cập nhật liên kết</h2>

        <div className="mb-4">
          <label htmlFor="mainCategoryId" className="block text-sm font-medium text-gray-700">
            Danh mục chính
          </label>
          <select
            id="mainCategoryId"
            value={mainCategoryId}
            onChange={(e) => setMainCategoryId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="extraCategoryId" className="block text-sm font-medium text-gray-700">
            Danh mục topping
          </label>
          <select
            id="extraCategoryId"
            value={extraCategoryId}
            onChange={(e) => setExtraCategoryId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandleUpdateMapping;
