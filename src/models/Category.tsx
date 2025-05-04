interface Category {
  id: string;
  categoryName: string;
  description: string;
  products: any[] | null;
  categoryExtraMappings: any[] | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}