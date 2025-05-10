import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface OrderSummaryProps {
  cart: OrderItem[];
  userInfo: User | null;
  onConfirmOrder: (order: any) => void;
  setIsCheckout: (val: boolean) => void;
  products: Product[];
  productSizes: ProductSize[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  userInfo,
  onConfirmOrder,
  setIsCheckout,
  products,
  productSizes,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | undefined
  >();
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const router = useRouter();
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherId, setVoucherId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const sizeMap: { [key: number]: string } = { 0: "S", 1: "M", 2: "L" };
  const paymentMethods = [
    { value: 0, label: "Momo" },
    { value: 1, label: "Tiền mặt" },
  ];

  const filteredVoucher =
    query === ""
      ? vouchers
      : vouchers.filter(
          (vou) => vou.voucherCode.toLowerCase() === query.toLowerCase()
        );

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

  const totalPrice = cart.reduce((sum, item) => {
    const toppingsPrice = (item.toppings ?? []).reduce(
      (tSum, topping: any) => tSum + (topping.productSizes[0]?.price ?? 0),
      0
    );
    return sum + (item.price + toppingsPrice) * item.quantity;
  }, 0);

  // const discountAmount = voucherId
  //   ? Math.floor(
  //       (totalPrice * (selectedVoucher?.discountPercentage || 0)) / 100
  //     )
  //   : 0;

  const checkVoucher = (selectedVoucher: Voucher) => {
    if (selectedVoucher?.priceCondition > totalPrice) {
      alert("Đơn hàng không đủ điều kiện để áp dụng voucher này");
      return;
    } else if (selectedVoucher.isActive === false) {
      alert("Voucher đã hết hạn sử dụng");
      return;
    } else {
      const discountAmount =
        (totalPrice * selectedVoucher.discountPercentage) / 100;
      const finalPrice = totalPrice - discountAmount;
      return { discountAmount, finalPrice };
    }
  };

  const handleConfirmOrder = () => {
    if (selectedPaymentMethod === undefined) {
      alert("Chọn phương thức thanh toán!");
      return;
    }

    if (selectedPaymentMethod === 0) {
      setShowConfirmPopup(true);
      return;
    }

    finalizeOrder();
  };

  const handleCorfirmOrderByMomo = (fromPopup: boolean = false) => {
    setShowConfirmPopup(false);
    finalizeOrder();
  };

  const finalizeOrder = async () => {
    try {
      // Step 1: Create the order
      const orderRes = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: "",
            paymentMethod: selectedPaymentMethod,
            userId: userInfo?.id,
            storeId: userInfo?.storeId,
            orderStatus: "Processing",
          }),
        }
      );

      if (!orderRes.ok) throw new Error("Tạo đơn hàng thất bại!");

      const newOrder = await orderRes.json();

      console.log("newOrder: " + newOrder);
      console.log("newOrder: " + newOrder.id);

      // Step 2: Create OrderItems
      for (const item of cart) {
        const toppingItems: string[] = [];

        if (item.toppings) {
          for (const topping of item.toppings) {
            const toppingId = topping.productSizes[0]?.id;
            if (!toppingId) {
              setOrderStatus("❌ Sản phẩm đi kèm chưa được set giá.");
              return;
            }
            toppingItems.push(toppingId);
          }
        }

        const orderItem = {
          orderId: newOrder.id,
          productSizeId: item.productSizeId,
          quantity: item.quantity,
          toppingItems: toppingItems,
          // toppingItems: item.toppings ? item.toppings.map((t) => t.id) : []
        };

        const itemRes = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/OrderItem",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderItem),
          }
        );
        console.log("productSizeId: " + orderItem.productSizeId);
        console.log("toppings: " + orderItem.toppingItems);
        console.log("quantity: " + orderItem.quantity);

        if (!itemRes.ok) throw new Error("Tạo OrderItem thất bại!");
      }

      // Step 3: Apply voucher (if have)
      if (voucherId) {
        const voucherRes = await fetch(
          `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/apply-voucher`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: newOrder.id,
              voucherId: voucherId,
            }),
          }
        );

        if (!voucherRes.ok) {
          setOrderStatus("⚠️ Áp dụng voucher thất bại!");
          return;
        }
      }

      // Step 4: Redirect
      setOrderStatus("Tạo đơn hàng thành công.");
      router.push(`/bill?orderId=${newOrder.id}`);

      onConfirmOrder(newOrder);
    } catch (error) {
      console.error("ORDER ERROR:", error);
      setOrderStatus("❌ Lỗi khi tạo đơn hàng. Hãy thử lại.");
    }
  };

  useState(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Voucher"
        );
        const data = await res.json();
        setVouchers(data);
      } catch (err) {
        console.error("Failed to fetch vouchers", err);
      }
    };

    fetchVouchers();
  });

  return (
    <div className="p-6 bg-[#1c2c4a] rounded-lg text-white max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛍️ Đơn hàng</h2>

      <div>
        <h3 className="font-semibold">Mặt hàng</h3>
        {cart.map((item, index) => {
          const details = getProductDetails(item);
          return (
            <div key={index} className="border-b border-gray-600 py-2">
              <div className="flex items-center justify-between">
                <span>
                  {details?.productName} ({details?.size})
                </span>
                <span>
                  {item.quantity} x {item.price.toLocaleString()}₫
                </span>
              </div>
              {item.toppings && item.toppings.length > 0 && (
                <div className="ml-4 mt-1 text-sm text-gray-300">
                  <p className="font-medium">Toppings:</p>
                  {item.toppings.map((topping, i: any) => (
                    <p key={i}>
                      - {topping.productName} (
                      {topping.productSizes[0]?.price.toLocaleString() ?? 0}₫)
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Chọn hình thức thanh toán</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <label key={method.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                onChange={(e) =>
                  setSelectedPaymentMethod(Number(e.target.value))
                }
                checked={selectedPaymentMethod === method.value}
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-600 mt-4 pt-4">
        <h3 className="font-semibold">Chọn voucher</h3>
        <div className="space-y-2">
          {/* <Combobox value={voucherId} onChange={setVoucherId}> */}
          <Combobox
            value={voucherId}
            onChange={(id) => {
              setVoucherId(id);
              const selected = vouchers.find((v) => v.id === id);
              setSelectedVoucher(selected || null);
            }}
          >
            <div className="relative">
              <ComboboxInput
                onChange={(e) => setQuery(e.target.value)}
                displayValue={(id: string) =>
                  vouchers.find((v) => v.id === id)?.voucherCode || ""
                }
                className="w-full border p-2 rounded-md text-black"
                placeholder="Nhập mã giảm giá..."
              />
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border shadow">
                {filteredVoucher.map((vou) => (
                  <ComboboxOption
                    key={vou.id}
                    value={vou.id}
                    className={({ active }) =>
                      `cursor-pointer px-4 py-2 text-black ${
                        active ? "bg-green-200" : "bg-white"
                      }`
                    }
                  >
                    {vou.voucherCode}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-600 pt-4 text-sm">
        <p className="font-bold text-white">
          Tổng tiền: {totalPrice.toLocaleString()}₫
        </p>

        {/* {selectedVoucher && (
          <>
            <p className="text-green-400">
              Giảm được: {discountAmount.toLocaleString()}₫
            </p>
            <p className="text-md text-yellow-300 font-semibold">
              Tiền sau khi giảm: {finalPrice.toLocaleString()}₫
            </p>
          </>
        )} */}
        {selectedVoucher &&
          (() => {
            const result = checkVoucher(selectedVoucher);
            if (!result) return null;
            return (
              <>
                <p className="text-green-400">
                  Giảm được: {result.discountAmount.toLocaleString()}₫
                </p>
                <p className="text-md text-yellow-300 font-semibold">
                  Tiền sau khi giảm: {result.finalPrice.toLocaleString()}₫
                </p>
              </>
            );
          })()}

        <button
          onClick={handleConfirmOrder}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl mt-4"
        >
          Xác nhận đơn hàng
        </button>
        <button
          onClick={() => setIsCheckout(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl mt-2"
        >
          Tiếp tục đặt món
        </button>
      </div>

      {showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg">
            <img
              src="/qr.jpeg"
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
                  handleCorfirmOrderByMomo(true);
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
