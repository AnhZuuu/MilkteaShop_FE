// // utils/handleDeleteMapping.ts

// components/ConfirmDeleteMappingModal.tsx

import React from "react";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteMappingModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Xác nhận xóa liên kết</h3>
        <p className="mb-6">Bạn thật sự muốn xóa liên kết này?</p>
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

const handleDeleteMapping = async (
  mappingId: string,
  refreshMappings: () => void 
) => {

  try {
    const res = await fetch(
      `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/CategoryExtraMapping/${mappingId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Xóa liên kết thất bại");
    }

    console.log("Xóa liên kết thành công");
    refreshMappings();
  } catch (error) {
    console.error(error);
    alert("Đã xảy ra lỗi khi xóa liên kết.");
  }
};

export {ConfirmDeleteMappingModal, handleDeleteMapping} ;