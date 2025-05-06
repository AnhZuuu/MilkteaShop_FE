'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type SummaryData = {
  totalOrders: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  storeId: string | null;
  storeName: string;
};

type ChartData = {
  date: string;
  total: number;
};

export default function LineChartFromAPI2() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<SummaryData>(
          'https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/today'
        );

        const summary = response.data;

        // Format date from startDate
        const date = new Date(summary.startDate).toISOString().split('T')[0];

        const chartData: ChartData[] = [
          {
            date,
            total: summary.totalAmount,
          },
        ];

        setData(chartData);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Doanh thu hôm nay</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toLocaleString()} VND`} />
          <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
