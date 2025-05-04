// components/HandleCreateProductSize.tsx
'use client';

import React, { useEffect, useState } from 'react';

type Product = {
  id: string;
  productName: string;
};

type ProductSizePayload = {
  productId: string;
  size: 0 | 1 | 2;
  price: number;
};

const SIZE_LABELS = ['S', 'M', 'L'];

export default function HandleCreateProductSize({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductSizePayload>({
    productId: '',
    size: 0,
    price: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Created successfully!');
      setFormData({ productId: '', size: 0, price: 0 });
      onSuccess?.();
    } else {
      setMessage('Failed to create.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Sản phẩm nào</label>
        <select
          className="w-full border rounded p-2"
          value={formData.productId}
          onChange={(e) =>
            setFormData({ ...formData, productId: e.target.value })
          }
          required
        >
          <option value="">Chọn sản phẩm</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.productName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Size</label>
        <select
          className="w-full border rounded p-2"
          value={formData.size}
          onChange={(e) =>
            setFormData({
              ...formData,
              size: Number(e.target.value) as 0 | 1 | 2,
            })
          }
          required
        >
          {SIZE_LABELS.map((label, index) => (
            <option key={index} value={index}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Giá (đ)</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          min={0}
          step={0.01}
          required
        />
      </div>

      {message && <p className="text-sm text-blue-600">{message}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create
      </button>
    </form>
  );
}
