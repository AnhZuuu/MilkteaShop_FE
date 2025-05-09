import React from "react";

interface Props {
  comboId: string;
  onDeleted: () => void;
}

const HandleDeleteCombo: React.FC<Props> = ({ comboId, onDeleted }) => {
  const handleDelete = async () => {
    if (!comboId) {
      console.error("Combo ID is missing.");
      return;
    }

    try {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ComboItem/${comboId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi khi xóa combo: ${errorText || "Unknown error"}`);
      }

      onDeleted(); // Notify parent to update combo list
    } catch (error) {
      console.error("Error while deleting combo:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
    >
      Xóa
    </button>
  );
};

export default HandleDeleteCombo;
