interface Order {
    id: string;
    orderNumber: string;
    totalAmount: number;
    description: string;
    orderItems: OrderItem[]; 
    paymentMethod: number; 
    userId: string;
    storeId: string | null;
    store: Store | null; 
    createdAt: string;
  }
  
  enum PaymentMethod {
    Momo = 0,
    Cash = 1 
  }
  