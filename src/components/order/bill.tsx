"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const BillPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await fetch(`https://6804e0a979cb28fb3f5c0f7e.mockapi.io/swp391/Orders/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to load order", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleReturnMenu = () => {
    localStorage.removeItem("cart"); // if you stored it there
    router.push("/menu");
  };

  if (!order) return <p className="text-white">Đang tải hoá đơn...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
    <div className="bg-[#1c2c4a] p-4 rounded-lg shadow-lg text-white max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">🧾 Hóa đơn thanh toán</h2>

      <p className="text-sm text-gray-300 mb-2">Mã đơn hàng: {order.orderNumber}</p>
      <p className="text-sm text-gray-300 mb-4">Phương thức thanh toán: {order.paymentMethodId}</p>

      {order.cartItems.length === 0 ? (
        <p className="text-gray-300">Không có mặt hàng nào trong đơn.</p>
      ) : (
        order.cartItems.map((item: any, index: number) => (
          <div
            key={item.id + "-" + index}
            className="mb-4 bg-[#26354d] p-3 rounded-lg relative"
          >
            <div className="flex items-center">
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-14 h-14 object-cover rounded mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{item.productName}</h3>
                <p className="text-xs text-gray-300">Kích cỡ: {item.selectedSize}</p>
                <p className="text-xs text-gray-300">Số lượng: {item.quantity}</p>
                <p className="text-xs text-gray-300">
                  Giá: {(item.price * item.quantity).toLocaleString()}₫
                </p>
              </div>
            </div>

            {item.toppings?.length > 0 && (
              <div className="mt-2 ml-3 border-l border-gray-500 pl-3">
                <p className="text-xs font-semibold text-gray-300">Topping:</p>
                {item.toppings.map((topping: any) => (
                  <div key={topping.id} className="text-xs text-gray-400">
                    - {topping.name} ({(topping.price ?? 0).toLocaleString()}₫)
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <div className="mt-6 border-t border-gray-600 pt-4 text-sm">        
        <p className="text-lg font-bold mt-1 text-white">
          💰 Tổng tiền: {order.totalAmount.toLocaleString()}₫
        </p>

        <button
          onClick={handleReturnMenu}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium"
        >
          ⬅️ Quay lại menu
        </button>
      </div>
    </div>
  </div>
  );
};

export default BillPage;
