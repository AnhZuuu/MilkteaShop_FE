import React, { useState } from "react";

interface Props {
  order: Order;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

const HandleUpdateOrder: React.FC<Props> = ({ order, onClose, onOrderUpdated }) => {
  const [description, setDescription] = useState(order.description || "");

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/${order.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...order, description }),
        }
      );

      if (!response.ok) throw new Error("Cập nhật thất bại");

      const updatedOrder = await response.json();
      onOrderUpdated(updatedOrder);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-lg">
        <h2 className="text-xl font-bold mb-4">Cập nhật đơn hàng</h2>
        <div className="mb-4">
          <label className="block font-medium">Mô tả:</label>
          <textarea
            className="w-full border p-2 rounded mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandleUpdateOrder;
