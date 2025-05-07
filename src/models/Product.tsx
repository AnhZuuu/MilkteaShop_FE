interface Product {
  id: string;
  productName: string;
  description: string;
  categoryId: string;
  category: string | null;
  imageUrl: string;
  productType: "Main" | "Extra" | string;
  productSizes: ProductSize[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdBy: string;
  updatedBy: string;
}


