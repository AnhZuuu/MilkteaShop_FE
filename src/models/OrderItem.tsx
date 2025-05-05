interface OrderItem {
    id: string;
    orderId: string;
    order: Order | null; 
    productSizeId: string;
    productSize: ProductSize | null; 
    quantity: number;
    price: number;
    description: string;
    toppings: Product[] | null; 
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    createdBy: string;
    updatedBy: string;
  }
  