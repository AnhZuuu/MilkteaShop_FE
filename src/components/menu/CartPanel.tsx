"use client";
import React, { useEffect, useState } from "react";


const sizeMap: { [key: number]: string } = {
  0 : "S",
  1 : "M",
  2 : "L",
};

interface CartPanelProps {
  cart: OrderItem[];
  onRemove: (index: number) => void;
  isCheckout: boolean;
  setIsCheckout: (value: boolean) => void;
  productSizes: ProductSize[];
  products: Product[];
}

const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  onRemove,
  isCheckout,
  setIsCheckout,
  productSizes,
  products,
}) => {
  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => {
    const toppingsPrice = (item.toppings ?? []).reduce(
      (tSum, topping: any) => tSum + (topping.productSizes[0]?.price ?? 0),
      0
    );
    return sum + (item.price + toppingsPrice) * item.quantity;
  }, 0);

  const getProductDetails = (item: OrderItem) => {
    const sizeInfo = productSizes.find((ps) => ps.id === item.productSizeId);
    if (!sizeInfo) return null;
    const productInfo = products.find((p) => p.id === sizeInfo.productId);
    return {
      productName: productInfo?.productName || "Sản phẩm không xác định",
      imageUrl: productInfo?.imageUrl || "",
      size: sizeMap[sizeInfo.size],
      basePrice: sizeInfo.price,
    };
  };

  return (
    <div className="bg-[#1c2c4a] p-4 rounded-lg shadow-lg text-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">
        🛒 Giỏ hàng
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-300">Chưa có món nào trong giỏ.</p>
      ) : (
        cart.map((item, index) => (
          <div
            key={item.id}
            className="mb-4 bg-[#26354d] p-3 rounded-lg relative"
          >
            <div className="flex items-center">
              {(() => {
                const details = getProductDetails(item);
                return (
                  <>
                    <img
                      src={details?.imageUrl}
                      alt={details?.productName}
                      className="w-14 h-14 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">
                        {details?.productName}
                      </h3>
                      <p className="text-xs text-gray-300">
                        Kích cỡ: {details?.size}
                      </p>
                      <p className="text-xs text-gray-300">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-300">
                        Giá: {(item.price * item.quantity).toLocaleString()}₫
                      </p>
                    </div>
                  </>
                );
              })()}
              {/* </div> */}
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-lg"
              >
                ✕
              </button>
            </div>

            {Array.isArray(item.toppings) && item.toppings.length > 0 && (
              <div className="mt-2 ml-3 border-l border-gray-500 pl-3">
                <p className="text-xs font-semibold text-gray-300">Topping:</p>
                {item.toppings.map((topping: Product) => (
                  <div key={topping.id} className="text-xs text-gray-400">
                    - {topping.productName} {" "}
                    ({(topping.productSizes[0]?.price ?? 0).toLocaleString()}₫)
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {cart.length > 0 && (
        <div className="mt-6 border-t border-gray-600 pt-4 text-sm">
          <p className="text-gray-300">🧾 Tổng số món: {totalItems}</p>
          <p className="text-lg font-bold mt-1 text-white">
            💰 Tổng tiền: {totalPrice.toLocaleString()}₫
          </p>
          {!isCheckout && (
            <button
              onClick={() => setIsCheckout(true)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium"
            >
              Thanh toán
            </button>
          )}
          {/* <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium">
            Tiếp tục đặt món
          </button> */}
        </div>
      )}
    </div>
  );
};

export default CartPanel;
