'use client';

import Image from "next/image";
import LineChartOne from "@/components/charts/line/LineChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import ProductTable from "@/components/productManagement/ProductTable";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Basic Table 3</h1>
      <ProductTable/>
    </div>
  );
}
