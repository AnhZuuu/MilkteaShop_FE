'use client';

import Image from "next/image";
import LineChartOne from "@/components/charts/line/LineChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import AppSidebar from "@/components/manager/SiderBar";

export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    //   <LineChartOne/>


    //   </main>
    //   <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
    //   <BarChartOne/>
    //   </footer>
    // </div>
    <div className="flex h-screen bg-blue-200 text-white">
      <AppSidebar/>
      <div
        className="transition-all duration-300 w-[85%] p-4 overflow-y-auto">
        <LineChartOne/>
      </div>
        <BarChartOne/>
    </div>
  );
}
