interface Voucher {
    id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    voucherCode: string;
    priceCondition: number;
    discountPercentage: number;
    exceedDate: string;
    orderList?: Order[]; 
  }