"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaStore,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import DailyChart from "@/components/charts/line/DailyChart";
import DailyChartForStore from "@/components/charts/line/DailyChartForStore";
import PaymentMethodPieChart from "@/components/charts/circle/PaymentMethodPieChart";


export default function StoreDetailPage({ params }: { params: { id: string } }) {
  const [store, setStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "cash" | "momo" | "revenue">("users");

  useEffect(() => {
    const fetchStoreAndOrders = async () => {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/${params.id}`,
        { cache: "no-store" }
      );
      if (!res.ok) return notFound();
      const storeData: Store = await res.json();
      setStore(storeData);

      const orderRes = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order`
      );
      const allOrders: Order[] = await orderRes.json();
      console.log(" ALL ORDER NÈ" + allOrders);

      // const storeOrders = allOrders.filter((o) =>
      //   storeData.users.some((u) => u.id === o.userId)
      // );
      const storeOrders = allOrders.filter((o) => o.storeId === storeData.id);

      console.log(" STORE ORDER NÈ" + storeOrders);

      setOrders(storeOrders);
      console.log(" STORE ORDER 222NÈ" + storeOrders);
    };

    fetchStoreAndOrders();
  }, [params.id]);

  if (!store) return <div>Loading...</div>;

  const filteredOrders = orders.filter(
    (o) => (activeTab === "cash" && o.paymentMethod === 1) || (activeTab === "momo" && o.paymentMethod === 0)
  );
  console.log(" filteredOrders filteredOrders NÈ" + filteredOrders);

  const paymentStats = [
    { name: 'Cash', value: orders.filter((o) => o.paymentMethod === 1).length },
    { name: 'Momo', value: orders.filter((o) => o.paymentMethod === 0).length },
  ];

  const COLORS = ['#0088FE', '#FF8042']; // Cash: Blue, Momo: Orange

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 relative">
        <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[35px] border-l-transparent border-r-transparent border-b-blue-500"></div>

        <div className="flex items-center mb-6 gap-3">
          <FaStore className="text-blue-600 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800">{store.storeName}</h1>
        </div>

        <p className="text-gray-600 mb-4">{store.description || "Không có mô tả"}</p>

        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-gray-500 mt-1" />
            <span className="text-gray-700">{store.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-500" />
            <span className="text-gray-700">{store.phoneNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            {store.isActive ? (
              <>
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-700 font-medium">Đang hoạt động</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-gray-400" />
                <span className="text-gray-500">Đã đóng cửa</span>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-3">
          <button
            className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("users")}
          >
            Nhân viên
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "cash" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("cash")}
          >
            Tiền mặt
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "momo" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("momo")}
          >
            Momo
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "revenue" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("revenue")}
          >
            Doanh thu cửa hàng
          </button>

          {store.users.length === 0 ?
            (
              <button
                className="text-white hover:bg-red-800 bg-red-600 px-4 py-2 rounded"
                onClick={async () => {
                  const confirmToggle = window.confirm(
                    store.isActive
                      ? "Bạn có chắc muốn tạm nghỉ cửa hàng này?"
                      : "Bạn có muốn mở cửa lại cửa hàng này?"
                  );
                  if (!confirmToggle) return;

                  try {
                    const updatedStore = {
                      ...store,
                      isActive: !store.isActive,
                    };

                    const res = await fetch(
                      `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/${store.id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedStore),
                      }
                    );

                    if (!res.ok) throw new Error("Failed to update store status");

                    // If API returns content
                    if (res.status !== 204) {
                      const newStore = await res.json();
                      setStore(newStore);
                      alert(`Cửa hàng đã được ${newStore.isActive ? "mở cửa" : "tạm nghỉ"}.`);
                    } else {
                      // If no content, update manually
                      setStore((prev) => {
                        if (!prev) return prev; // or return null;
                        return { ...prev, isActive: !prev.isActive };
                      });

                      alert(`Cửa hàng đã được ${!store.isActive ? "mở cửa" : "tạm nghỉ"}.`);
                    }
                  } catch (error) {
                    console.error("Error updating store:", error);
                    alert("Có lỗi khi cập nhật trạng thái cửa hàng.");
                  }
                }}
              >
                {store.isActive ? "Tạm nghỉ cửa hàng" : "Mở cửa lại cửa hàng"}
              </button>

            )
            :
            (<></>)}
        </div>

        <div className="mt-6">
          {activeTab === "users" && (
            <div className="space-y-4">
              {store.users.length === 0 ?
                (<p className="text-gray-500">Không có nhân viên ở chi nhánh này.</p>)
                :
                (<>{store.users.map((user) => (
                  <div key={user.username} className="flex items-center gap-3">
                    <img
                      src={user.imageUrl || "https://via.placeholder.com/50"}
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-gray-700 font-medium">{user.username}</p>
                      <p className="text-gray-500">{user.role}</p>
                      <p className="text-gray-500">{user.phoneNumber}</p>
                      <p className="text-gray-500">{user.email || "Chưa có email"}</p>
                    </div>
                    <div className="ml-auto">
                      {user.isActive ? (
                        <span className="text-green-500">Hoạt động</span>
                      ) : (
                        <span className="text-gray-500">Không hoạt động</span>
                      )}
                    </div>
                  </div>
                ))}
                </>)}

            </div>
          )}

          {(activeTab === "cash" || activeTab === "momo") && (
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <p className="text-gray-500">Không có đơn hàng.</p>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-300 rounded p-4 bg-gray-50"
                  >
                    <p><strong>Mã đơn:</strong> {order.orderNumber}</p>
                    <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()}₫</p>
                    <p><strong>Ngày:</strong> {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "revenue" && (<>
            <div className="bg-white p-4 rounded-2xl shadow w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Tỉ lệ thanh toán</h2>
              <PaymentMethodPieChart orders={orders} />
            </div>

            <DailyChart />
            
            <div className="space-y-4">
              <DailyChartForStore storeId={params.id} />
            </div>


          </>
          )}


        </div>
      </div>
    </div>
  );
}
