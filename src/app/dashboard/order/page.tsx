'use client';

import Image from "next/image";
// import LineChartOne from "@/components/charts/line/LineChartOne";
// import BarChartOne from "@/components/charts/bar/BarChartOne";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import OrderTable from "@/components/orderManagement/OrderTable";
const OrderTable = dynamic(() => import("@/components/orderManagement/OrderTable"), {
  ssr: false,
});

const LineChartOne = dynamic(() => import("@/components/charts/line/LineChartOne"), {
  ssr: false,
});

const BarChartOne = dynamic(() => import("@/components/charts/bar/BarChartOne"), {
  ssr: false,
});
export default function Home() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [width, setWidth] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);



  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.replace("/");
      } else {
        setUser(JSON.parse(userData));
        setLoading(false);
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
        <LineChartOne />
        <BarChartOne />
      </div>
  </div>
  );
}
