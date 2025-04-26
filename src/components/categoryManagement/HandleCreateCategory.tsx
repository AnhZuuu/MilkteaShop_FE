import { Category } from "./CategoryTable";

export const createCategory = async (
  category: Partial<Category>,
  setCategory: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  try {
    const response = await fetch(
      "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/Category/Create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      }
    );

    if (!response.ok) throw new Error("Failed to create category");

    const newCategory = await response.json();
    setCategory((prev) => [...prev, newCategory]);
  } catch (error) {
    console.error("Create error:", error);
  }
};
