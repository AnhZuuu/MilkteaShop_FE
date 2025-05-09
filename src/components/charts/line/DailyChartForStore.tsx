'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type StatsPeriod = {
  totalOrders: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  storeId: string;
  storeName: string;
};

type StatsResponse = {
  today: StatsPeriod;
  week: StatsPeriod;
  month: StatsPeriod;
  year: StatsPeriod;
};

type ChartData = {
  date: string;
  total: number;
  totalOrders: number;
};

type DailyChartForStoreProps = {
  storeId: string;
};

export default function DailyChartForStore({ storeId }: DailyChartForStoreProps) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return;

      try {
        const response = await axios.get<StatsResponse>(
          `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/stats?storeId=${storeId}`
        );

        const stats = response.data;

        const chartData: ChartData[] = [
          {
            date: 'Hôm nay',
            total: stats.today.totalAmount,
            totalOrders: stats.today.totalOrders
          },
          {
            date: 'Tuần này',
            total: stats.week.totalAmount,
            totalOrders: stats.week.totalOrders
          },
          {
            date: 'Tháng này',
            total: stats.month.totalAmount,
            totalOrders: stats.month.totalOrders
          },
          {
            date: 'Năm nay',
            total: stats.year.totalAmount,
            totalOrders: stats.year.totalOrders
          },
        ];

        setData(chartData);
      } catch (error) {
        console.error('Error fetching store stats:', error);
      }
    };

    fetchData();
  }, [storeId]);

  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Doanh thu tổng hợp</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          {/* <Tooltip formatter={(value: number) => `${value.toLocaleString()} VND`} /> */}
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'total') return [`${value.toLocaleString()} VND`, 'Doanh thu'];
              if (name === 'totalOrders') return [value, 'Số đơn'];
              return [value, name];
            }}
          />
          <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" strokeWidth={2} />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
