import React from "react";

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Xác nhận xóa phân loại</h3>
        <p className="mb-6">Bạn chắc chắn muốn xóa phân loại này vĩnh viễn?</p>
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

const HandleDeleteCategory = async (id: string, category: Category[], setCategories: React.Dispatch<React.SetStateAction<any[]>> ) => {
  try {
    const res = await fetch(
      `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!res.ok) {
      throw new Error("Lỗi khi xóa category");
    }
    setCategories((prev) => prev.filter((category) => category.id !== id));

  } catch (error) {
    console.error("Error deleting category:", error);
  
  }

};

const ValidationModal = ({ onClose }: { onClose : () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
      <h3 className="text-xl font-semibold mb-4 text-red-600">
        Không thể xóa
      </h3>
      <p className="mb-6">Phân loại này hiện đang có sản phẩm.</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);


export {ConfirmDeleteModal, ValidationModal, HandleDeleteCategory};
