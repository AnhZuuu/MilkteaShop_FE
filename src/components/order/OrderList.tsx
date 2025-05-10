"use client";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Props {
  orders: Order[];
  storeId?: string;
  setOrders: (updatedOrder: any) => void;
}

const paymentMethodMap: Record<number, string> = {
  0: "Momo",
  1: "Tiền mặt",
};

const OrderList: React.FC<Props> = ({ orders, setOrders, storeId }) => {
  // const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // const [store, setStore] = useState<Store[]>([]);
  const [storeFilter, setStoreFilter] = useState(storeId);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const router = useRouter();

  const statusClassMap: Record<string, string> = {
    Processing: "bg-blue-200 text-blue-800",
    Completed: "bg-green-200 text-green-800",
    Cancelled: "bg-red-200 text-red-800",
  };
  const statusMap: { [key: string]: string } = {
    Processing: "Đang xử lý",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  useEffect(() => {
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

    fetchUsers();
  }, []);

  // useEffect (() => {
  //   const fetchStores = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store"
  //       );
  //       const dataStores: Store[] = await response.json();
  //       console.log("Fetched Stores:", dataStores);
  //       setStore(dataStores);
  //     } catch (error) {
  //       console.log("Error fetching stores:", error);
  //     }
  //   };

  //   fetchStores();
  // }, [users])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.orderNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesPayment =
        paymentFilter === "all" ||
        paymentMethodMap[order.paymentMethod] === paymentFilter;

      const matchesStore =
        storeFilter === "all" || order.storeId === storeId;
      return matchesSearch && matchesPayment && matchesStore ;
    });
  }, [orders, searchTerm, paymentFilter, storeFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const toggleOrderStatus = async (order: Order) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn cập nhập lại trạng thái của đơn hàng này?`
    );
    if (!confirm) return;

    const updateStatus = {
      ...order,
      orderStatus: order.orderStatus,
      orderItems: [],
    };

    try {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateStatus),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");

      setOrders(updateStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 bg-white rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 m-2 w-full">
        <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h2>
      </div>

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
            className="w-[80] p-2 border rounded-lg mr-4"
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
              Người tạo
            </th>
            {/* <th className="border border-gray-300 px-4 py-2 text-left">
              Cửa hàng
            </th> */}
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ngày tạo
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Trạng thái
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
              {/* <td className="border border-gray-300 px-4 py-2">
                {store.find((s) => s.id === order.storeId)?.storeName || ""}
              </td> */}
              <td className="border border-gray-300 px-4 py-2">
                <div>{format(order.createdAt, "MMM dd, yyyy")}</div>
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {order.orderStatus === "Processing" ? (
                  <select
                    className={`p-1 rounded ${
                      statusClassMap[order.orderStatus || "Processing"]
                    }`}
                    value={order.orderStatus || "Processing"}
                    onChange={(e) =>
                      toggleOrderStatus({
                        ...order,
                        orderStatus: e.target.value,
                      })
                    }
                  >
                    <option value="Processing">Đang xử lý</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                ) : (
                  <td className={`p-1 rounded ${
                      statusClassMap[order.orderStatus || "Processing"]
                    }`}>
                    <div>{statusMap[order.orderStatus || ""]}</div>
                  </td>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                    onClick={() => router.push(`/bill?orderId=${order.id}`)}
                  >
                    <FiEye className="w-5 h-5" />
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
    </div>
  );
};

export default OrderList;
