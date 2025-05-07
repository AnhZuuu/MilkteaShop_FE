'use client';

import React, { useEffect, useState } from 'react';

type Product = {
  id: string;
  productName: string;
  productType: 'Main' | 'Extra' | null;
};

type ProductSizePayload = {
  productId: string;
  productName: string; 
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
    productName: '',
    size: 0,
    price: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          'https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product'
        );
        const data: Product[] = await res.json();
        const mainProducts = data.filter(p => p.productType === 'Main');
        setProducts(mainProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Ensure productName is updated when productId or size changes
  useEffect(() => {
    const product = products.find(p => p.id === formData.productId);
    if (product) {
      const fullName = `${product.productName} size ${SIZE_LABELS[formData.size]}`;
      setFormData(prev => ({ ...prev, productName: fullName }));
    } else {
      setFormData(prev => ({ ...prev, productName: '' }));
    }
  }, [formData.productId, formData.size, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        'https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData), // 👈 includes productName
        }
      );

      if (res.ok) {
        setMessage('✅ Tạo thành công!');
        setFormData({ productId: '', productName: '', size: 0, price: 0 });
        onSuccess?.();
      } else {
        setMessage('❌ Tạo thất bại.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage('❌ Lỗi kết nối.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Sản phẩm</label>
        <select
          className="w-full border rounded p-2"
          value={formData.productId}
          onChange={(e) =>
            setFormData({ ...formData, productId: e.target.value })
          }
          required
        >
          <option value="">-- Chọn sản phẩm --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.productName}
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
          {SIZE_LABELS.map((label, idx) => (
            <option key={idx} value={idx}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Giá (VNĐ)</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          min={0}
          step={1000}
          required
        />
      </div>

      {formData.productName && (
        <div className="text-sm text-gray-600">
          <strong>Tên đầy đủ:</strong> {formData.productName}
        </div>
      )}

      {message && <p className="text-sm text-blue-600">{message}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tạo
      </button>
    </form>
  );
}
