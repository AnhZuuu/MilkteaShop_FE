'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Order = {
  totalAmount: number;
  createdAt: string;
};

type ChartData = {
  date: string;
  total: number;
};

export default function LineChartFromAPI() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Order[]>('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order');
        const orders = response.data;

        // Group by date
        const grouped: { [date: string]: number } = {};

        for (const order of orders) {
          const date = new Date(order.createdAt).toISOString().split('T')[0]; // 'YYYY-MM-DD'
          grouped[date] = (grouped[date] || 0) + order.totalAmount;
        }

        const chartData = Object.entries(grouped)
          .map(([date, total]) => ({ date, total }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Doanh thu theo ngày</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toLocaleString()} VND`} />
          <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
