import { Category } from "./CategoryTable";

export const deleteCategory = async (
  id: string,
  categories: Category[],
  setCategory: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  const categoryToDelete = categories.find((c) => c.id === id);
  if (categoryToDelete?.products && categoryToDelete.products.length > 0) {
    alert("This category has products and cannot be deleted.");
    return;
  }

  try {
    const response = await fetch(
      `https://`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw new Error("Failed to delete category");

    setCategory((prev) => prev.filter((c) => c.id !== id));
  } catch (error) {
    console.error("Delete error:", error);
  }
};
