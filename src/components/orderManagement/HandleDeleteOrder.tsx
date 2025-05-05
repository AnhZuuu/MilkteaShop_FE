import React from "react";

interface Props {
  orderId: string;
  onClose: () => void;
  onDeleted: () => void;
}

const ConfirmDeleteOrderModal: React.FC<Props> = ({ orderId, onClose, onDeleted }) => {
  const handleDelete = async () => {
    try {
      await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/${orderId}`,
        { method: "DELETE" }
      );
      onDeleted();
    } catch (error) {
      console.error("Failed to delete order", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Xác nhận xoá đơn hàng</h2>
        <p className="mb-6">Bạn có chắc chắn muốn xoá đơn hàng này?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Huỷ
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteOrderModal;
