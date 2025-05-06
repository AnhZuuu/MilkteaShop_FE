"use client";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import HandleUpdateOrder from "./HandleUpdateOrder";
import ConfirmDeleteOrderModal from "./HandleDeleteOrder";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  description: string;
  orderItems: any[];
  paymentMethod: number;
  userId: string;
  storeId: string | null;
  store: any;
  createdAt: string;
}

const paymentMethodMap: Record<number, string> = {
  0: "Momo",
  1: "Tiền mặt",
};

const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [store, setStore] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order"
        );
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/User"
        );
        const data: User[] = await response.json();
        console.log("Fetched DATA:", data);
        setUsers(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store"
        );
        const dataStores: Store[] = await response.json();
        console.log("Fetched Stores:", dataStores);
        setStore(dataStores);
      } catch (error) {
        console.log("Error fetching stores:", error);
      }
    };

    fetchOrders();
    fetchUsers();
    fetchStores();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.orderNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesPayment =
        paymentFilter === "all" ||
        paymentMethodMap[order.paymentMethod] === paymentFilter;

      const matchesStore =
        storeFilter === "all" || order.storeId === storeFilter;

      return matchesSearch && matchesPayment && matchesStore;
    });
  }, [orders, searchTerm, paymentFilter, storeFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const handleUpdateClick = (order: Order) => {
    setSelectedOrder(order);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const handleOrderDeleted = (deletedOrderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== deletedOrderId));
  };

  return (
    <div className="mx-auto max-w-5xl p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h2>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="relative md:basis-2/3 w-full">
          <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex md:basis-1/3 w-full">
          <select
            className="w-full p-2 border rounded-lg"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">Phương thức thanh toán</option>
            {Object.entries(paymentMethodMap).map(([key, label]) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded-lg"
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
          >
            <option value="all">Cửa hàng</option>
            {store.map((s) => (
              <option key={s.id} value={s.id}>
                {s.storeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Mã đơn
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Mô tả
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Tổng tiền
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Thanh toán
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Người dùng
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Cửa hàng
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ngày tạo
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order) => (
            <tr key={order.id}>
              <td className="border border-gray-300 px-4 py-2">
                {order.orderNumber}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.totalAmount.toLocaleString()}₫
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {paymentMethodMap[order.paymentMethod]}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {users.find((user) => user.id === order.userId)?.username || ""}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {store.find((s) => s.id === order.storeId)?.storeName || ""}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div>{format(order.createdAt, "MMM dd, yyyy")}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                    onClick={() => router.push(`/dashboard/order/${order.id}`)}
                  >
                    <FiEye className="w-5 h-5" />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800"
                    title="Edit Order"
                    onClick={() => handleUpdateClick(order)}
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Delete User"
                    onClick={() => handleDeleteClick(order)}
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between">
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border rounded-md ${
                currentPage === page ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Trang tiếp theo
        </button>
      </div>

      {showUpdateModal && selectedOrder && (
        <HandleUpdateOrder
          order={selectedOrder}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedOrder(null);
          }}
          onOrderUpdated={handleOrderUpdated}
        />
      )}

      {showDeleteModal && selectedOrder && (
        <ConfirmDeleteOrderModal
          orderId={selectedOrder.id}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedOrder(null);
          }}
          onDeleted={() => {
            handleOrderDeleted(selectedOrder.id);
            setShowDeleteModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderTable;
