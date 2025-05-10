"use client";
import OrderList from "@/components/order/OrderList";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.replace("/");
      } else {
        const parsedUser = JSON.parse(userData);
        console.log(parsedUser)
        setUser(parsedUser);
        setLoading(false);
      }
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order"
        );
        setOrders(res.data.filter((o : any) => o.orderStatus !== "Processing"));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = (updateStatus: any) => {
    setOrders((prev : any) =>
        prev.map((o : any) => (o.id === updateStatus.id ? updateStatus : o))
      );
  }
  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 sm:p-10 space-y-10 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      {user?.storeId && <OrderList orders={orders} storeId={user.storeId} setOrders={handleUpdateStatus}/>}
      
    </div>
  );
}
