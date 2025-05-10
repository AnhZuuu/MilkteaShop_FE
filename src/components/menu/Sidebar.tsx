import Link from "next/link";
import React, { useEffect, useState } from "react";

interface SidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category"
        );
        const data = await response.json();
        setCategories(data.filter((cate: any) => !cate.categoryName.toLowerCase().includes("topping")));
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded bg-[#1c2c4a] text-white placeholder-gray-400 outline-none"
        />
      </div>
      <hr className="border-blue-600 mb-4" />
      <div className="space-y-2">
        <Link href={`/menu/combo`}>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-[#1c2c4a] ">
            Combo
          </button>
        </Link>

        <button
          key={"all"}
          onClick={() => setSelectedCategory("all")}
          className={`w-full text-left px-4 py-2 rounded ${selectedCategory === "all" ? "bg-blue-600" : "hover:bg-[#1c2c4a]"
            }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`w-full text-left px-4 py-2 rounded ${selectedCategory === cat.id ? "bg-blue-600" : "hover:bg-[#1c2c4a]"
              }`}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
