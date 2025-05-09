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
  paymentMethod: number; // 1 = Cash, 0 = Momo
};

type Props = {
  orders: Order[];
};

const COLORS = ['#0088FE', '#FF8042']; // Cash for: Blue, Momo for: Orange

export default function PaymentMethodPieChart({ orders }: Props) {
  const paymentStats = [
    {
      name: 'Tiền mặt',
      value: orders.filter((o) => o.paymentMethod === 1).length,
    },
    {
      name: 'Momo',
      value: orders.filter((o) => o.paymentMethod === 0).length,
    },
  ];

  const total = paymentStats.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-white p-4 rounded-2xl shadow w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ thanh toán</h2>
      {total === 0 ? (
        <p className="text-gray-500">Chưa có đơn hàng nào.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentStats}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {paymentStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} đơn hàng`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
