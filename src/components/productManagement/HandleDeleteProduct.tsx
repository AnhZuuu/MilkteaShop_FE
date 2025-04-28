import { Product } from "./ProductTable";

export const deleteProduct = async (
  id: string,
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  try {
    const response = await fetch(
      `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw new Error("Failed to delete product");

    setProducts((prev) => prev.filter((p) => p.id !== id));
  } catch (error) {
    console.error("Delete product error:", error);
  }
};
