"use client";
import React, { useState } from "react";

interface Store {
  id: string;
  storeName: string;
  description?: string;
  address: string;
  phoneNumber: string;
  updatedBy?: string;
  updatedAt?: Date;
}

interface HandleUpdateStoreProps {
  store: Store;
  onClose: () => void;
  userInfo: any;
  onStoreUpdated: (updatedStore: Store) => void;
}

const HandleUpdateStore: React.FC<HandleUpdateStoreProps> = ({
  store,
  onClose,
  userInfo,
  onStoreUpdated,
}) => {
  const [storeName, setStoreName] = useState(store.storeName);
  const [description, setDescription] = useState(store.description);
  const [address, setAddress] = useState(store.address);
  const [phoneNumber, setPhoneNumber] = useState(store.phoneNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim() || !address.trim() || !phoneNumber.trim()) return;

    const updatedStore = {
      ...store,
      storeName,
      description,
      address,
      phoneNumber,
      updatedBy: userInfo?.userId || "unknown",
      updatedAt: new Date(),
    };

    try {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/${store.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}` || ``,
          },
          body: JSON.stringify(updatedStore),
        }
      );

      if (!res.ok) {
        throw new Error("Lỗi khi cập nhật store");
      }

      onStoreUpdated(updatedStore);
    } catch (error) {
      console.error("Lỗi cập nhật store:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Cập nhật cửa hàng
          </h3>
          <p className="text-gray-600 text-sm">
            Thay đổi thông tin cho cửa hàng đã chọn.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="storeName"
                className="text-sm font-bold text-gray-700"
              >
                Tên cửa hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="address"
                className="text-sm font-bold text-gray-700"
              >
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="phoneNumber"
                className="text-sm font-bold text-gray-700"
              >
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandleUpdateStore;
