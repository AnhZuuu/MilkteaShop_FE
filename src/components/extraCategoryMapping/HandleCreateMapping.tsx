"use client";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import React, { useEffect, useState } from "react";

interface HandleCreateMappingProps {
  categories: Category[];
  onClose: () => void;
  onCreated: () => void;
}

const HandleCreateMapping: React.FC<HandleCreateMappingProps> = ({
  onClose,
  categories,
  onCreated,
}) => {
  const [mainCategoryId, setMainCategoryId] = useState<string | null>(null);
  const [extraCategoryId, setExtraCategoryId] = useState<string | null>(null);
  const [mainQuery, setMainQuery] = useState("");
  const [extraQuery, setExtraQuery] = useState("");

  const filteredMain =
    mainQuery === ""
      ? categories
      : categories.filter((cat) =>
          cat.categoryName.toLowerCase().includes(mainQuery.toLowerCase())
        );

  const filteredExtra =
    extraQuery === ""
      ? categories
      : categories.filter((cat) =>
          cat.categoryName.toLowerCase().includes(extraQuery.toLowerCase())
        );

  const handleSubmit = async () => {
    if (!mainCategoryId || !extraCategoryId) return;

    const newMapping = {
      mainCategoryId,
      extraCategoryId,
    };

    try {
      const res = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/CategoryExtraMapping",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMapping),
        }
      );

      if (!res.ok) {
        throw new Error("Lỗi khi tạo mapping");
      }
      onCreated();
      console.log("Mapping created successfully");
    } catch (err) {
      console.error(err);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-5">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Tạo liên kết danh mục
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Danh mục chính
            </label>
            <Combobox value={mainCategoryId} onChange={setMainCategoryId}>
              <div className="relative">
                <ComboboxInput
                  onChange={(e) => setMainQuery(e.target.value)}
                  displayValue={(id: string) =>
                    categories.find((c) => c.id === id)?.categoryName || ""
                  }
                  className="w-full border p-2 rounded-md"
                  placeholder="Tìm danh mục..."
                />
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border shadow">
                  {filteredMain.map((cat) => (
                    <ComboboxOption
                      key={cat.id}
                      value={cat.id}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 ${
                          active ? "bg-blue-100" : "bg-white"
                        }`
                      }
                    >
                      {cat.categoryName}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </div>
            </Combobox>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Danh mục phụ (Topping)
            </label>
            <Combobox value={extraCategoryId} onChange={setExtraCategoryId}>
              <div className="relative">
                <ComboboxInput
                  onChange={(e) => setExtraQuery(e.target.value)}
                  displayValue={(id: string) =>
                    categories.find((c) => c.id === id)?.categoryName || ""
                  }
                  className="w-full border p-2 rounded-md"
                  placeholder="Tìm topping..."
                />
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border shadow">
                  {filteredExtra.map((cat) => (
                    <ComboboxOption
                      key={cat.id}
                      value={cat.id}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 ${
                          active ? "bg-blue-100" : "bg-white"
                        }`
                      }
                    >
                      {cat.categoryName}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </div>
            </Combobox>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm text-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white"
          >
            Tạo liên kết
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandleCreateMapping;
