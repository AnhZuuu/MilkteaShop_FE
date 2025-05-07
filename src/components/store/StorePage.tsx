"use client";
import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaStore,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import HandleCreateStore from "./HandleCreateStore";
import HandleUpdateStore from "./HandleUpdateStore";
import Link from "next/link";

type Store = {
  id: string;
  storeName: string;
  address: string;
  phoneNumber: string;
  description?: string;
  isActive?: boolean;
};

const StorePage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const userInfo = {
    userId: "admin-user",
    token: "your-jwt-token",
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store"
      );
      if (!res.ok) throw new Error("Failed to fetch stores");
      const data = await res.json();
      setStores(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleStoreCreated = (newStore: Store) => {
    setStores((prev) => [...prev, newStore]);
  };

  const handleStoreUpdated = (updatedStore: Store) => {
    setStores((prev) =>
      prev.map((store) => (store.id === updatedStore.id ? updatedStore : store))
    );
  };

  const activeStores = stores.filter((store) => store.isActive !== false);

  const filteredStores = activeStores.filter((store) => {
    const query = searchQuery.toLowerCase();
    return (
      store.storeName.toLowerCase().includes(query) ||
      store.address.toLowerCase().includes(query) ||
      store.phoneNumber.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Các cửa hàng của chúng tôi</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <FaPlus className="mr-2" /> Tạo cửa hàng mới
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm cửa hàng theo tên, địa chỉ hoặc số điện thoại..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <p className="text-center text-gray-600">Đang tải cửa hàng...</p>}
      {error && <p className="text-center text-red-600">Lỗi: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 relative"
          >
            {/* Triangle roof */}
            <div className="absolute -top-[20px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[75px] border-r-[75px] border-b-[40px] border-l-transparent border-r-transparent border-b-blue-500 z-10"></div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaStore className="text-blue-500 text-xl mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">{store.storeName}</h2>
                </div>
                <button
                  onClick={() => {
                    setEditingStore(store);
                    setShowUpdateModal(true);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-700"
                  title="Chỉnh sửa cửa hàng"
                >
                  <FaEdit className="text-lg" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2" />
                  <p className="text-gray-600">{store.address}</p>
                </div>

                <div className="flex items-center">
                  <FaPhone className="text-gray-500 mr-2" />
                  <p className="text-gray-600">{store.phoneNumber}</p>
                </div>

                <div className="flex items-center">
                  <span
                    className={`ml-3 text-sm font-medium px-2 py-0.5 rounded-full ${store.isActive
                        ? "bg-green-100 text-green-700 animate-heartBeat"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {store.isActive ? "Đang hoạt động" : "Đã đóng cửa"}
                  </span>
                </div>
              </div>

              <Link href={`/dashboard/store/${store.id}`}>
                <button className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300">
                  Xem chi tiết
                </button>
              </Link>

            </div>
          </div>
        ))}
      </div>

      {/* Create Store Modal */}
      {showCreateModal && (
        <HandleCreateStore
          onClose={() => setShowCreateModal(false)}
          onStoreCreated={handleStoreCreated}
        />
      )}

      {/* Update Store Modal */}
      {showUpdateModal && editingStore && (
        <HandleUpdateStore
          store={editingStore}
          userInfo={userInfo}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingStore(null);
          }}
          onStoreUpdated={handleStoreUpdated}
        />
      )}
    </div>
  );
};

export default StorePage;
