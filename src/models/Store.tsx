interface Store {
    id: string;
    storeName: string;
    description: string;
    address: string;
    phoneNumber: string;
    users: User[]; 
    orders: Order[]; 
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
  }
  