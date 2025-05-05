"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/${id}`
      );
      const data = await res.json();
      setOrder(data);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Chi tiết hóa đơn</h2>
      <p>
        <strong>Mã đơn:</strong> {order.orderNumber}
      </p>
      <p>
        <strong>Tổng tiền:</strong> {order.totalAmount} VND
      </p>
      <p>
        <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
      </p>
      <p>
        <strong>Người dùng:</strong> {order.userId}
      </p>
      <p>
        <strong>Cửa hàng:</strong> {order.storeId}
      </p>
      <p>
        <strong>Ngày tạo:</strong> {new Date(order.createdAt).toLocaleString()}
      </p>
      <hr className="my-4" />
      <h3 className="text-lg font-semibold">Sản phẩm đã đặt:</h3>
      <ul className="list-disc pl-5">
        {order.orderItems.map((item: any, index: number) => (
          <li key={index}>
            {item.productName} - SL: {item.quantity} - Giá: {item.price} VND
          </li>
        ))}
      </ul>

      <button
        onClick={() => router.push("/dashboard/order")}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Quay lại danh sách đơn hàng
      </button>
    </div>
  );
};

export default OrderDetailPage;
