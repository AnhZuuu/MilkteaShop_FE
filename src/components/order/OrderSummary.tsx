import React, { useState } from "react";
import { Product } from "../productManagement/ProductTable";


interface PaymentMethod {
  id: string;
  name: string;
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
  onConfirmOrder: (order: any) => void; // Pass order details when confirmed
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, onConfirmOrder }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const paymentMethods: PaymentMethod[] = [
    { id: "paypal", name: "PayPal" },
    { id: "cash", name: "Cash on Delivery" },
  ];

  const totalPrice = cart.reduce((sum, item) => {
    const toppingsPrice = item.toppings.reduce((tSum, topping : any) => tSum + topping.Price, 0);
    return sum + (item.price + toppingsPrice) * item.quantity;
  }, 0);

  const handleConfirmOrder = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method!");
      return;
    }

    const orderDetails = {
      orderNumber: `ORD-${new Date().getTime()}`,
      totalAmount: totalPrice,
      description: "Order description goes here...",
      paymentMethodId: selectedPaymentMethod.id,
      userId: "User123", // You would typically get this from the logged-in user
      cartItems: cart,
    };

    onConfirmOrder(orderDetails);
  };

  return (
    <div className="p-6 bg-[#1c2c4a] rounded-lg text-white max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛍️ Order Summary</h2>

      <div>
        <h3 className="font-semibold">Items</h3>
        {cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b border-gray-600 py-2">
            <span>{item.productName}</span>
            <span>{item.quantity} x {item.price.toLocaleString()}₫</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Select Payment Method</h3>
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
        <p className="font-bold text-white">Total: {totalPrice.toLocaleString()}₫</p>
        <button
          onClick={handleConfirmOrder}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl mt-4"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
