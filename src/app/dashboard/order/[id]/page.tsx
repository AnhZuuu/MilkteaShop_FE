"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const paymentMethodMap: { [key: number]: string } = {
    0: "Momo",
    1: "Tiền mặt",
  };
  const sizeMap: { [key: number]: string } = { 0: "S", 1: "M", 2: "L" };
  const statusClassMap: Record<string, string> = {
    Processing: "bg-blue-200 text-blue-800",
    Completed: "bg-green-200 text-green-800",
    Cancelled: "bg-red-200 text-red-800",
  };
  const statusMap: { [key: string]: string } = {
    "Processing": "Đang xử lý",
    "Completed": "Hoàn thành",
    "Cancelled": "Đã hủy",
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/");
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "Admin" && parsedUser.role !== "Manager") {
        router.replace("/");
      } else {
        setUser(parsedUser);
        setLoading(false);
      }
    }

    const fetchOrder = async () => {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/${id}`
      );
      const orderData = await res.json();

      // Enrich each item
      const enrichedItems = await Promise.all(
        orderData.orderItems.map(async (item: any) => {
          const psRes = await fetch(
            `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize/${item.productSizeId}`
          );
          const productSize = await psRes.json();

          const pRes = await fetch(
            `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product/${productSize.productId}`
          );
          const product = await pRes.json();

          console.log("productSize: " + productSize);
          console.log("product: " + product.productName);

          const userRes = await fetch(
            `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/User/${orderData.userId}`
          );
          const user = await userRes.json();
          setUser(user);

          const storeRes = await fetch(
            `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/${user.storeId}`
          );
          const dataStores = await storeRes.json();
          console.log("Fetched Stores:", dataStores);
          setStore(dataStores);

          // Enrich toppings: each has productSizeId
          const enrichedToppings = await Promise.all(
            (item.toppings || []).map(async (t: any) => {
              const toppingPSRes = await fetch(
                `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize/${t.toppingProductSizeId}`
              );
              const toppingProductSize = await toppingPSRes.json();

              const toppingPRes = await fetch(
                `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product/${toppingProductSize.productId}`
              );
              const toppingProduct = await toppingPRes.json();
              console.log(
                "product topping name: " + toppingProduct.productName
              );

              return {
                id: t.productSizeId,
                name: toppingProduct?.productName || "Sản phẩm không xác định",
                imageUrl: toppingProduct.imageUrl,
                price: toppingProductSize.price ?? 0,
                size: toppingProductSize.size,
              };
            })
          );

          return {
            ...item,
            selectedSize: productSize.size,
            productName: product?.productName || "Sản phẩm không xác định",
            imageUrl: product.imageUrl,
            productPrice: productSize.price,
            toppings: enrichedToppings,
          };
        })
      );

      // After fetching the order

      setOrder({ ...orderData, orderItems: enrichedItems } as any);
      // setOrder(data);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/dashboard/order")}
          className="text-black hover:underline hover:text-green-600"
        >
          ⬅️ Quay lại
        </button>
      </div>
      <div className="bg-[#1c2c4a] p-4 rounded-lg shadow-lg text-white max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">
          🧾 Hóa đơn thanh toán
        </h2>

        <p className="text-sm text-gray-300 mb-2">
          Mã đơn hàng: {order.orderNumber}
        </p>
        <p className="text-sm text-gray-300 mb-4">
          Phương thức thanh toán: {paymentMethodMap[order.paymentMethod]}
        </p>
        <p className="text-sm text-gray-300 mb-4">
          Người tạo: {user?.username || "Không rõ"}
        </p>
        <p className="text-sm text-gray-300 mb-4">
          Cửa hàng: {store?.storeName || ""}
        </p>
        <p className="text-sm text-gray-300 mb-4">
          Ngày tạo: {format(order.createdAt, "MMM dd, yyyy")}
        </p>
        <p className="text-sm text-gray-300 mb-4">
          Trạng thái đơn hàng: {statusMap[order.orderStatus || ""]}
        </p>
        <div className="font-bold mb-4 border-b border-gray-600 pb-2"></div>
        {order.orderItems.length === 0 ? (
          <p className="text-gray-300">Không có mặt hàng nào trong đơn.</p>
        ) : (
          order.orderItems.map((item: any, index: number) => (
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
                  <p className="text-xs text-gray-300">
                    Kích cỡ: {sizeMap[item.selectedSize]}
                  </p>
                  <p className="text-xs text-gray-300">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="text-xs text-gray-300">
                    Giá: {(item.productPrice * item.quantity).toLocaleString()}₫
                  </p>
                </div>
              </div>

              {item.toppings?.length > 0 && (
                <div className="mt-2 ml-3 border-l border-gray-500 pl-3">
                  <p className="text-xs font-semibold text-gray-300">
                    Topping:
                  </p>
                  {item.toppings.map((topping: any) => (
                    <div key={topping.id} className="text-xs text-gray-400">
                      - {topping.name} ({(topping.price ?? 0).toLocaleString()}
                      ₫)
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {order.voucherId ? (
          <div className="border-t border-gray-600 pt-4 text-sm">
            <p className="text-md font-bold text-white">
              🎫 Voucher: {order.voucherId}
            </p>
          </div>
        ) : (
          <></>
        )}

        <div className="mt-6 border-t border-gray-600 pt-4 text-sm">
          <p className="text-lg font-bold mt-1 text-white">
            💰 Tổng tiền: {order.totalAmount.toLocaleString()}₫
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
