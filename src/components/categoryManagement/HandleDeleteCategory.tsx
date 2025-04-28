import { Category } from "./CategoryTable";

// HandleDeleteCategory.ts
export const deleteCategory = async (id: string, category: Category[], setCategories: React.Dispatch<React.SetStateAction<any[]>> ) => {
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
