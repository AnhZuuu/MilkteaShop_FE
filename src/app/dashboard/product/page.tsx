'use client';

import Image from "next/image";
import LineChartOne from "@/components/charts/line/LineChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import ProductTable from "@/components/productManagement/ProductTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6"></h1>
      <ProductTable userInfo={undefined}/>
    </div>
  );
}
