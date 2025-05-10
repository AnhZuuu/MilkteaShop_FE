"use client";
import React from "react";

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteVoucherModal = ({
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Xác nhận xóa voucher</h3>
        <p className="mb-6">Bạn thật sự muốn xóa voucher này?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

const handleDeleteVoucher = async (
  id: string,
  vouchers: Voucher[],
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>
) => {
  try {
    const response = await fetch(
      `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Voucher/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw new Error("Failed to delete voucher");

    setVouchers((prev) => prev.filter((v) => v.id !== id));
  } catch (error) {
    console.error("Delete voucher error:", error);
  }
};

export {ConfirmDeleteVoucherModal, handleDeleteVoucher}
