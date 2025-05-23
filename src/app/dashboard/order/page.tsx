'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
// import OrderTable from "@/components/orderManagement/OrderTable";
const OrderTable = dynamic(() => import("@/components/orderManagement/OrderTable"), {
  ssr: false,
});

const DailyChart = dynamic(() => import("@/components/charts/line/DailyChart"), {
  ssr: false,
});

const PaymentMethodPieChart = dynamic(() => import("@/components/charts/circle/PaymentMethodPieChart"), {
  ssr: false,
});
export default function Home() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [width, setWidth] = useState(0);
  const [orders, setOrders] = useState([]);


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order"
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }

  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 sm:p-10 space-y-12 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <h1 className="text-2xl font-bold text-center">Doanh thu</h1>
      <OrderTable />
      {/* Charts in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyChart />
        <PaymentMethodPieChart orders={orders}/>
      </div>
  </div>
  );
}
