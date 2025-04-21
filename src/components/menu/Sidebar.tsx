import React, { useEffect, useState } from "react";

interface SidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

interface Categories {
  Id: string;
  CategoryName: string;
  Description: string;
  IsActive: boolean; // Status of the product (active/inactive)
  CreatedAt: Date; // Timestamp for when the product was created
  UpdatedAt: Date; // Timestamp for when the product was updated
  DeletedAt: Date; // Timestamp for when the product was deleted
  CreatedBy: string; // Creator of the product
  UpdatedBy: string; // User who last updated the product
}

// const categories = [
//   { key: "all", label: "Tất cả" },
//   { key: "do-an", label: "Đồ ăn" },
//   { key: "nuoc-uong", label: "Nước uống" },
//   { key: "an-vat", label: "Ăn vặt" },
// ];

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://6801a85581c7e9fbcc430ea1.mockapi.io/swp391/categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.log("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  });
  return (
    <div className="w-[15%] bg-[#101d34] p-4">
      <div className="mb-6">
        <img src="/logo.png" alt="Logo" className="w-24 mx-auto mb-4" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full p-2 rounded bg-[#1c2c4a] text-white placeholder-gray-400 outline-none"
        />
      </div>
      <hr className="border-blue-600 mb-4" />
      <div className="space-y-2">
        <button
          key={"all"}
          onClick={() => setSelectedCategory("all")}
          className={`w-full text-left px-4 py-2 rounded ${
            selectedCategory === "all" ? "bg-blue-600" : "hover:bg-[#1c2c4a]"
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.Id}
            onClick={() => setSelectedCategory(cat.Id)}
            className={`w-full text-left px-4 py-2 rounded ${
              selectedCategory === cat.Id ? "bg-blue-600" : "hover:bg-[#1c2c4a]"
            }`}
          >
            {cat.CategoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
