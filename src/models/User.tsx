interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  role: string;
  orders: any[]; 
  storeId: string | null;
  store: any | null; 
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdBy: string;
  updatedBy: string;
}