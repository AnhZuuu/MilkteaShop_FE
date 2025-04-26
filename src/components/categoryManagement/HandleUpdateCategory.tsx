import { Category } from "./CategoryTable";

export const updateCategory = async (
  updatedData: Category,
  setCategory: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  try {
    const response = await fetch(
      `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/Category/Update/${updatedData.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) throw new Error("Failed to update category");

    const updated = await response.json();
    setCategory((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  } catch (error) {
    console.error("Update error:", error);
  }
};
