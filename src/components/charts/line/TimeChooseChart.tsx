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
import clsx from 'clsx';

type SummaryData = {
  totalOrders: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  storeId: string | null;
  storeName: string;
};

type ApiResponse = {
  today: SummaryData;
  week: SummaryData;
  month: SummaryData;
  year: SummaryData;
};

type ChartData = {
  date: string;
  total: number;
};

const rangeOptions = ['today', 'week', 'month', 'year'] as const;
type RangeType = typeof rangeOptions[number];

export default function TimeChooseChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [selectedRange, setSelectedRange] = useState<RangeType>('today');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          'https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/stats'
        );

        const summary = response.data[selectedRange];

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
  }, [selectedRange]);

  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Doanh thu từ ngày ...  đến nay</h2>

      <div className="flex gap-2 mb-4">
        {rangeOptions.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={clsx(
              'px-3 py-1 rounded-full border',
              selectedRange === range
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            )}
          >
            {range === 'today'
              ? 'Hôm nay'
              : range === 'week'
              ? 'Tuần'
              : range === 'month'
              ? 'Tháng'
              : 'Năm'}
          </button>
        ))}
      </div>

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
