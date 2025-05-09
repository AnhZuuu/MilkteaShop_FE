// ComboTable.tsx
"use client";
import React, { useEffect, useState } from "react";
import HandleCreateCombo from "./HandleCreateCombo";
import HandleDeleteCombo from "./HandleDeleteCombo";

export interface ProductSize {
  id: string;
  productId: string;
  productName: string;
  size: number;
  price: number;
}

export interface Combo {
  comboCode: string;
  description: string;
  productSizes: ProductSize[];
  price: number;
}

const ComboTable = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchCombos = async () => {
    try {
      const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ComboItem");
      const data = await res.json();
      setCombos(data);
    } catch (error) {
      console.error("Failed to fetch combos:", error);
    }
  };
  

  useEffect(() => {
    fetchCombos();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Danh sách Combo</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tạo Combo
        </button>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">Combo Code</th>
              <th className="border p-2">Mô tả</th>
              <th className="border p-2">Giá</th>
              <th className="border p-2">Sản phẩm</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((combo) => (
              <tr key={combo.comboCode}>
                <td className="border p-2 font-semibold">{combo.comboCode}</td>
                <td className="border p-2">{combo.description}</td>
                <td className="border p-2">{combo.price.toLocaleString()}đ</td>
                <td className="border p-2">
                  <ul className="list-disc pl-4">
                    {combo.productSizes.map((ps) => (
                      <li key={ps.id}>{ps.productName} - {ps.price.toLocaleString()}đ</li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2">
                  <HandleDeleteCombo comboCode={combo.comboCode} onDeleted={fetchCombos} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <HandleCreateCombo
          onClose={() => setShowModal(false)}
          onComboCreated={fetchCombos}
        />
      )}
    </div>
  );
};

export default ComboTable;

