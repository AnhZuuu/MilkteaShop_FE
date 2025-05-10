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
  orders: number
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

        // console.log("RESPONSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"+response);

        const summary = response.data[selectedRange];
        // console.log("SUMMARYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"+summary)
        console.log("SUMMARYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY ORDERSSSSSSSS" + summary.totalOrders)

        const date = new Date(summary.startDate).toISOString().split('T')[0];

        const chartData: ChartData[] = [
          {
            date,
            total: summary.totalAmount,
            orders: summary.totalOrders
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

      {data.length > 0 && (
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-gray-100 p-4 rounded-xl shadow text-center">
            <p className="text-gray-600 text-sm">Số đơn</p>
            <p className="text-2xl font-bold text-blue-600">
              {data[0].orders.toLocaleString()} đơn
            </p>
          </div>

          <div className="flex-1 bg-gray-100 p-4 rounded-xl shadow text-center">
            <p className="text-gray-600 text-sm">Tổng tiền</p>
            <p className="text-2xl font-bold text-green-600">
              {data[0].total.toLocaleString()} VND
            </p>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'orders') return [`${value.toLocaleString()} đơn`, 'Số đơn'];
              if (name === 'total') return [`${value.toLocaleString()} VND`, 'Tổng tiền'];
              return [value, name];
            }}
          />
          <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={3} name="orders" />
          <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={3} name="total" />
        </LineChart>
        {/* <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toLocaleString()} đơn`} />
          <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={3} />

          <Tooltip formatter={(value: number) => `${value.toLocaleString()} VND`} />
          <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={3} />
        </LineChart> */}
      </ResponsiveContainer>
    </div>
  );
}
