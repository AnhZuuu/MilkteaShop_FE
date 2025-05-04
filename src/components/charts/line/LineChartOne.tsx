"use client";

import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";

type Order = {
  OrderNumber?: string;
  totalAmount?: number;
  TotalAmount?: number;
  CreatedAt: number;
};

export default function LineChartFromAPI() {
  const [series, setSeries] = useState<ApexAxisChartSeries>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<Order[]>("https://6804e0a979cb28fb3f5c0f7e.mockapi.io/swp391/Orders"); 
        const rawData = response.data;

        const normalized = rawData
          .map((item) => ({
            amount: item.totalAmount ?? item.TotalAmount ?? 0,
            date: new Date(item.CreatedAt * 1000), // UNIX timestamp to JS Date
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        const chartData = normalized.map((entry) => entry.amount);
        const chartLabels = normalized.map((entry) =>
          entry.date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );

        setSeries([{ name: "Total Amount", data: chartData }]);
        setCategories(chartLabels);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      }
    }

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 310,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: ["#465FFF"],
    stroke: { curve: "straight", width: 2 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
    tooltip: { x: { format: "dd MMM" } },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 0,
      strokeColors: "#fff",
      hover: { size: 6 },
    },
    legend: { show: false },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[1000px]">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}




// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";

// export default function LineChartOne() {
//   const options: ApexOptions = {
//     legend: {
//       show: false, // Hide legend
//       position: "top",
//       horizontalAlign: "left",
//     },
//     colors: ["#465FFF", "#9CB9FF"], // Define line colors
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       height: 310,
//       type: "line", // Set the chart type to 'line'
//       toolbar: {
//         show: false, // Hide chart toolbar
//       },
//     },
//     stroke: {
//       curve: "straight", // Define the line style (straight, smooth, or step)
//       width: [2, 2], // Line width for each dataset
//     },

//     fill: {
//       type: "gradient",
//       gradient: {
//         opacityFrom: 0.55,
//         opacityTo: 0,
//       },
//     },
//     markers: {
//       size: 0, // Size of the marker points
//       strokeColors: "#fff", // Marker border color
//       strokeWidth: 2,
//       hover: {
//         size: 6, // Marker size on hover
//       },
//     },
//     grid: {
//       xaxis: {
//         lines: {
//           show: false, // Hide grid lines on x-axis
//         },
//       },
//       yaxis: {
//         lines: {
//           show: true, // Show grid lines on y-axis
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false, // Disable data labels
//     },
//     tooltip: {
//       enabled: true, // Enable tooltip
//       x: {
//         format: "dd MMM yyyy", // Format for x-axis tooltip
//       },
//     },
//     xaxis: {
//       type: "category", // Category-based x-axis
//       categories: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       axisBorder: {
//         show: false, // Hide x-axis border
//       },
//       axisTicks: {
//         show: false, // Hide x-axis ticks
//       },
//       tooltip: {
//         enabled: false, // Disable tooltip for x-axis points
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           fontSize: "12px", // Adjust font size for y-axis labels
//           colors: ["#6B7280"], // Color of the labels
//         },
//       },
//       title: {
//         text: "", // Remove y-axis title
//         style: {
//           fontSize: "0px",
//         },
//       },
//     },
//   };

//   const series = [
//     {
//       name: "Sales",
//       data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
//     },
//     {
//       name: "Revenue",
//       data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
//     },
//   ];
//   return (
//     <div className="max-w-full overflow-x-auto custom-scrollbar">
//       <div id="chartEight" className="min-w-[1000px]">
//         <Chart options={options} series={series} type="area" height={310} />
//       </div>
//     </div>
//   );
// }
