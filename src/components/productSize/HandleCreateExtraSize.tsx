'use client';

import React, { useEffect, useState } from 'react';

type Product = {
  id: string;
  productName: string;
  productType: 'Main' | 'Extra' | null;
};

type Props = {
  product?: Product | null;
  onSuccess?: () => void;
};

export default function HandleCreateExtraSize({ product, onSuccess }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product');
      const data: Product[] = await res.json();
      const extras = data.filter((p) => p.productType === 'Extra');
      setProducts(extras);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedProductId(product.id);
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!selectedProductId || price <= 0) {
      alert('Vui lòng chọn topping và nhập giá hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          size: -1, // Toppings always use -1 as size
          price: price,
        }),
      });

      if (!res.ok) throw new Error('Failed to create');

      alert('Thêm giá topping thành công!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi thêm giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Chọn topping</label>
        <select
          disabled={!!product}
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Chọn topping --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.productName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Giá</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {isSubmitting ? 'Đang thêm...' : 'Thêm giá topping'}
      </button>
    </div>
  );
}
