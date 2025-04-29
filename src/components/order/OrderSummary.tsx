import React, { useState } from "react";

interface PaymentMethod {
  id: string;
  name: string;
}

interface Product {
  id: string;
  productName: string;
  description: string;
  categoryId: string;
  category: any;
  imageUrl: string;
  productType: string | null;
  productSizes: any[];
  price: number;
  isActive: boolean;
}

interface CartItem {
  id: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  selectedSize: string;
  toppings: Product[];
  note?: string;
}

interface OrderSummaryProps {
  cart: CartItem[];
  onConfirmOrder: (order: any) => void; 
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  onConfirmOrder,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    { id: "momo", name: "Momo" },
    { id: "cash", name: "Tiền mặt" },
  ];

  const totalPrice = cart.reduce((sum, item) => {
    const toppingsPrice = (item.toppings ?? []).reduce(
      (tSum, topping: any) => tSum + topping.price,
      0
    );
    return sum + (item.price + toppingsPrice) * item.quantity;
  }, 0);

  const handleConfirmOrder = () => {
    if (!selectedPaymentMethod) {
      alert("Chọn phương thức thanh toán!");
      return;
    }

    if (selectedPaymentMethod.id === "momo") {
      setShowConfirmPopup(true);
      return; 
    }

    finalizeOrder();
  };

  const finalizeOrder = async () => {
    const orderDetails = {
      orderNumber: `ORD-${new Date().getTime()}`,
      totalAmount: totalPrice,
      description: "Order description goes here...",
      paymentMethodId: selectedPaymentMethod?.id,
      userId: "User123", // You would typically get this from the logged-in user
      cartItems: cart.map((item) => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize,
        note: item.note ?? "",
        toppings: item.toppings.map((topping: any) => ({
          id: topping.Id,
          name: topping.ProductName,
          price: topping.Price,
        })),
      })),
    };

    try {
      const response = await fetch(
        "https://6804e0a979cb28fb3f5c0f7e.mockapi.io/swp391/Orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        }
      );

      if (!response.ok) throw new Error("Failed to place order");

      const result = await response.json();
      setOrderStatus("✅ Order successfully!");
      onConfirmOrder(result); // pass the server response back to parent
    } catch (error) {
      console.error(error);
      setOrderStatus("❌ Order failed. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-[#1c2c4a] rounded-lg text-white max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛍️ Dơn hàng</h2>

      <div>
        <h3 className="font-semibold">Mặt hàng</h3>
        {cart.map((item, index) => (
          <div key={index} className="border-b border-gray-600 py-2">
            <div className="flex items-center justify-between">
              <span>
                {item.productName} ({item.selectedSize})
              </span>
              <span>
                {item.quantity} x {item.price.toLocaleString()}₫
              </span>
            </div>
            {item.toppings.length > 0 && (
              <div className="ml-4 mt-1 text-sm text-gray-300">
                <p className="font-medium">Toppings:</p>
                {item.toppings.map((topping, i: any) => (
                  <p key={i}>
                    - {topping.productName} ({topping.price.toLocaleString()}₫)
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Chọn hình thức thanh toán</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <label key={method.id} className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                onChange={() => setSelectedPaymentMethod(method)}
                checked={selectedPaymentMethod?.id === method.id}
              />
              <span>{method.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-600 pt-4 text-sm">
        <p className="font-bold text-white">
          Tổng tiền: {totalPrice.toLocaleString()}₫
        </p>
        <button
          onClick={handleConfirmOrder}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl mt-4"
        >
          Xác nhận đơn hàng
        </button>
      </div>

      {showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg">
            <img
              src="/logo.png"
              alt={"QR"}
              className="mx-auto"
              width={400}
              height={400}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowConfirmPopup(false)}
              >
                Hủy
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowConfirmPopup(false);
                  finalizeOrder();
                }}
              >
                Đã thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {orderStatus && (
        <div className="mt-4 text-sm text-center font-medium">
          {orderStatus}
        </div>
      )}

    </div>
  );
};

export default OrderSummary;
