interface ComboItem {
  id: string;
  comboCode: string;
  description: string;
  price: number;
  products: {
    productId: string;
    productName: string;
    imageUrl: string;
    isActive: boolean
    productSize: {
      productSizeId : string;
      size : number
      price : number;
    }
  }[];
}