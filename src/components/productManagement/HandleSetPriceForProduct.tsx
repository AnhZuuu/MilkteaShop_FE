"use client";
import React, { useState } from "react";

interface HandleSetPriceProductProps {
  product: any;
  userInfo: any;
  onClose: () => void;
}

const HandleSetPriceProduct: React.FC<HandleSetPriceProductProps> = ({
  product,
  userInfo,
  onClose,
}) => {
  const [priceS, setPriceS] = useState<number | null>(null);
  const [priceM, setPriceM] = useState<number | null>(null);
  const [priceL, setPriceL] = useState<number | null>(null);
  const [extraPrice, setExtraPrice] = useState<number | null>(null);

  const handleSubmit = async () => {
    try {
      if (product.productType === "Main") {
        const sizes = [
          { size: 0, price: priceS, label: "S" },
          { size: 1, price: priceM, label: "M" },
          { size: 2, price: priceL, label: "L" },
        ];

        for (const s of sizes) {
          if (s.price !== null) {
            await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.token}`,
              },
              body: JSON.stringify({
                productId: product.id,
                productName: `${product.productName} size ${s.label}`,
                size: s.size,
                price: s.price,
              }),
            });
          }
        }
      } else {
        if (extraPrice !== null) {
          await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo?.token}`,
            },
            body: JSON.stringify({
              productId: product.id,
              productName: `${product.productName} (Topping)`,
              size: -1,
              price: extraPrice,
            }),
          });
        }
      }

      onClose();
    } catch (err) {
      console.error("Error setting prices:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Nhập giá cho {product.productName}</h2>
        {product.productType === "Main" ? (
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Gía tiền size S</label>
            <input type="number" placeholder="Nhập giá" value={priceS ?? ""} onChange={(e) => setPriceS(Number(e.target.value))} className="w-full p-2 border rounded" />
            <label className="text-sm font-bold text-gray-700">Gía tiền size M</label>
            <input type="number" placeholder="Nhập giá" value={priceM ?? ""} onChange={(e) => setPriceM(Number(e.target.value))} className="w-full p-2 border rounded" />
            <label className="text-sm font-bold text-gray-700">Gía tiền size L :</label>
            <input type="number" placeholder="Nhập giá" value={priceL ?? ""} onChange={(e) => setPriceL(Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
        ) : (
          <>
            <label className="text-sm font-bold text-gray-700">Gía của topping :</label>
            <input type="number" placeholder="Giá topping" value={extraPrice ?? ""} onChange={(e) => setExtraPrice(Number(e.target.value))} className="w-full p-2 border rounded" />
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Hủy</button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default HandleSetPriceProduct;
