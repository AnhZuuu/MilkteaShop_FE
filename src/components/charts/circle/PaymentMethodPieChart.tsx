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
  totalAmount: number;
};

type Props = {
  orders: Order[];
};

const COLORS = ['#0088FE', '#FF8042']; // Cash = Blue, Momo = Orange

export default function PaymentMethodPieChart({ orders }: Props) {
  const paymentStats = [
    {
      name: 'Tiền mặt',
      value: orders.filter((o) => o.paymentMethod === 1).length,
      amount: orders
        .filter((o) => o.paymentMethod === 1)
        .reduce((sum, o) => sum + o.totalAmount, 0),
    },
    {
      name: 'Chuyển khoản',
      value: orders.filter((o) => o.paymentMethod === 0).length,
      amount: orders
        .filter((o) => o.paymentMethod === 0)
        .reduce((sum, o) => sum + o.totalAmount, 0),
    },
  ];

  const total = paymentStats.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-white p-4 rounded-2xl shadow w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ thanh toán</h2>
      {total === 0 ? (
        <p className="text-gray-500">Chưa có đơn hàng nào.</p>
      ) : (
        <>
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
              <Tooltip
                formatter={(value: number, name: string) => {
                  const entry = paymentStats.find((e) => e.name === name);
                  const amount = entry?.amount.toLocaleString() ?? '0';
                  return [`${value} đơn hàng - ${amount} VND`, name];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Optional detailed legend */}
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            {paymentStats.map((entry, index) => (
              <div key={index} className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></span>
                  {entry.name}
                </span>
                <span>
                  {entry.value.toLocaleString()} đơn hàng -{' '}
                  {entry.amount.toLocaleString()} VND
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
