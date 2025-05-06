'use client';

import React, { useState } from 'react';

type ProductSize = {
    productId: string;
    size: 0 | 1 | 2;
    price: number;
};

const SIZE_LABELS = ['S', 'M', 'L'];

export default function HandleUpdateProductSize({
    initialData,
    onClose,
    onSuccess,
}: {
    initialData: ProductSize;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const [price, setPrice] = useState<number>(initialData.price);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(
                `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize/${initialData.productId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...initialData,
                        price,
                    }),
                }
            );

            if (res.ok) {
                setMessage('✅ Cập nhật thành công!');
                onSuccess?.();
                onClose();
            } else {
                setMessage('❌ Cập nhật thất bại.');
            }
        } catch (err) {
            console.error('Update error:', err);
            setMessage('❌ Lỗi kết nối.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Size</label>
                <div className="p-2 border rounded bg-gray-100">
                    {SIZE_LABELS[initialData.size]}
                </div>
            </div>

            <div>
                <label className="block mb-1 font-medium">Giá (VNĐ)</label>
                <input
                    type="number"
                    className="w-full border rounded p-2"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    required
                />
            </div>

            {message && <p className="text-sm text-blue-600">{message}</p>}

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Cập nhật
                </button>
            </div>
        </form>
    );
}
