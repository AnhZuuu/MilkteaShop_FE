"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCarousel from "@/components/topSellingProducts/ProductCard";
const OrderTable = dynamic(
  () => import("@/components/orderManagement/OrderTable"),
  {
    ssr: false,
  }
);

const DailyChart = dynamic(
  () => import("@/components/charts/line/DailyChart"),
  {
    ssr: false,
  }
);

const PaymentMethodPieChart = dynamic(() => import("@/components/charts/circle/PaymentMethodPieChart"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState([]);


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
    <div className="p-6 sm:p-10 space-y-10 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <h1 className="text-2xl font-bold text-center">Thống kê</h1>
      <div className="p-6 bg-white rounded-lg shadow overflow-x-auto scrollbar-hidden">
        <h1 className="text-2xl font-bold">Top 5 sản phẩm bán chạy</h1>
        <ProductCarousel />
      </div>
      {/* Charts in one row */}
      <h1 className="text-2xl font-bold">Doanh thu</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyChart />
        <PaymentMethodPieChart orders={orders}/>
      </div>
      <h1 className="text-2xl font-bold">Đơn hàng</h1>
      <OrderTable />
    </div>
  );
}
