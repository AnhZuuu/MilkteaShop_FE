'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Order = {
  orderStatus: 'Processing' | 'Completed' | 'Cancelled';
};

type Props = {
  orders: Order[];
};

const STATUS_LABELS: Record<string, string> = {
  Processing: 'Đang xử lý',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã huỷ',
};

const COLORS = ['#FFBB28', '#00C49F', '#FF4C4C']; // Yellow, Green, Red

export default function OrderStatusPieChart({ orders }: Props) {
  const statusStats = ['Processing', 'Completed', 'Cancelled'].map((status) => {
    const filtered = orders.filter((o) => o.orderStatus === status);
    return {
      name: STATUS_LABELS[status],
      value: filtered.length,
    };
  });

  const total = statusStats.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-white p-4 rounded-2xl shadow w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Trạng thái đơn hàng</h2>
      {total === 0 ? (
        <p className="text-gray-500">Chưa có đơn hàng nào.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} đơn hàng`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Optional status summary below */}
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            {statusStats.map((entry, index) => (
              <div key={index} className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></span>
                  {entry.name}
                </span>
                <span>{entry.value.toLocaleString()} đơn hàng</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
