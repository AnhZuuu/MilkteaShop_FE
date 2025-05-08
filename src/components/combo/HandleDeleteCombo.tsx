import React from "react";

interface Props {
  comboCode: string;
  onDeleted: () => void;
}

const HandleDeleteCombo: React.FC<Props> = ({ comboCode, onDeleted }) => {
  const handleDelete = async () => {
    if (!comboCode) {
      console.error("Combo code is missing.");
      return;
    }

    try {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ComboItem/${comboCode}`,
        { method: "DELETE" }
      );

      // Check if the response status is not okay
      if (!res.ok) {
        const errorText = await res.text(); // Get the response text
        throw new Error(`Lỗi khi xóa combo: ${errorText || "Unknown error"}`);
      }

      onDeleted(); // Notify parent component to update state
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
