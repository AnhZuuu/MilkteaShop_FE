"use client";

import Image from "next/image";
import LineChartOne from "@/components/charts/line/LineChartOne";
import LineChartFromAPI2 from "@/components/charts/line/LineChartTwo";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderTable from "@/components/orderManagement/OrderTable";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeChart, setActiveChart] = useState<"chart1" | "chart2">("chart1");

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
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Doanh thu</h1>

      {/* Buttons to switch chart */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setActiveChart("chart1")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeChart === "chart1"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Biểu đồ tổng hợp
        </button>
        <button
          onClick={() => setActiveChart("chart2")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeChart === "chart2"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Biểu đồ hôm nay
        </button>
      </div>

      {/* Conditional rendering of charts */}
      {activeChart === "chart1" ? <LineChartOne /> : <LineChartFromAPI2 />}
    </div>
  );
}
