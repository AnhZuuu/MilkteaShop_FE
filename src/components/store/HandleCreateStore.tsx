"use client";
import React, { useState, useEffect } from "react";

export interface CreateStorePayload {
  storeName: string;
  description: string;
  address: string;
  phoneNumber: string;
}

interface HandleCreateStoreProps {
  onClose: () => void;
  onStoreCreated: (newStore: any) => void;
}

const HandleCreateStore: React.FC<HandleCreateStoreProps> = ({
  onClose,
  onStoreCreated,
}) => {
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userInfo, setUserInfo] = useState<{ token: string } | null>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (err) {
        console.error("Failed to parse userInfo from localStorage", err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim() || !description.trim() || !address.trim() || !phoneNumber.trim()) return;

    const newStore: CreateStorePayload = {
      storeName,
      description,
      address,
      phoneNumber,
    };

    try {
      const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token || ""}`,
        },
        body: JSON.stringify(newStore),
      });
      
      if (!res.ok) throw new Error("Lỗi tạo store");
      
      let created = null;
      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        created = await res.json();
      }
      
      onStoreCreated(created ?? {
        ...newStore,
        id: crypto.randomUUID(), // fallback dummy id
      });
      
    } catch (error) {
      console.error("Lỗi khi tạo cửa hàng:", error);
    } finally {
      onClose();
      setStoreName("");
      setDescription("");
      setAddress("");
      setPhoneNumber("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">Tạo mới cửa hàng</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Tên cửa hàng *</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ví dụ: MilkTea Shop"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Mô tả *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm"
              placeholder="Giới thiệu ngắn về cửa hàng"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Địa chỉ *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ví dụ: 123 Đường ABC, Quận 1"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Số điện thoại *</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ví dụ: 19001009"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandleCreateStore;
