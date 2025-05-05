'use client';

import Image from "next/image";
import LineChartOne from "@/components/charts/line/LineChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderTable from "@/components/orderManagement/OrderTable";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/"); 
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
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

    {/* OrderTable below charts */}
    
  </div>
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <h1>Doanh thu</h1>
    //   <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    //   <LineChartOne/>


    //   </main>
    //   <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
    //   <BarChartOne/>
    //   </footer>
    // </div>
  );
}
