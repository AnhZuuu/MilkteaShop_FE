interface Order {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  orderNumber: string;
  totalAmount: number;
  description: string;
  orderItems: OrderItem[];
  paymentMethod: number;
  userId: string;
  user: User;
  storeId: string | null;
  store: Store;
  voucherId: string | null;
  voucher: Voucher | null;
  orderStatus: string | null;
}

  
  