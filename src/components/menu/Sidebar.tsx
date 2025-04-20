import React from "react";

interface SidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categories = [
  { key: "all", label: "Tất cả" },
  { key: "do-an", label: "Đồ ăn" },
  { key: "nuoc-uong", label: "Nước uống" },
  { key: "an-vat", label: "Ăn vặt" },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, setSelectedCategory }) => {
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
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`w-full text-left px-4 py-2 rounded ${
              selectedCategory === cat.key ? "bg-blue-600" : "hover:bg-[#1c2c4a]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;