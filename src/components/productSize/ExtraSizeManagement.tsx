'use client';

import React, { useEffect, useState } from 'react';
import HandleCreateExtraSize from './HandleCreateExtraSize';

type Product = {
  id: string;
  productName: string;
  productType: 'Main' | 'Extra' | null;
};

type ProductSize = {
  productId: string;
  size: number;
  price: number;
};

export default function ExtraSizeManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOnlyUnpriced, setShowOnlyUnpriced] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, sizesRes] = await Promise.all([
        fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product'),
        fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize'),
      ]);

      const productsData: Product[] = await productsRes.json();
      const sizesData: ProductSize[] = await sizesRes.json();

      const extras = productsData.filter((p) => p.productType === 'Extra');
      setProducts(extras);
      setProductSizes(sizesData);
    };

    fetchData();
  }, [showModal]);

  const extrasWithoutPrice = products.filter(
    (p) => !productSizes.some((ps) => ps.productId === p.id && ps.size === -1)
  );

  const filteredProducts = showOnlyUnpriced ? extrasWithoutPrice : products;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý giá Topping</h1>

      <div className="flex justify-between items-center">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOnlyUnpriced}
            onChange={(e) => setShowOnlyUnpriced(e.target.checked)}
            className="accent-blue-500"
          />
          <span>Chỉ hiển thị topping chưa có giá</span>
        </label>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Thêm giá topping
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Product List */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="p-4 border-b font-semibold bg-gray-100">
            Danh sách topping
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Tên</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-100 text-center text-xl cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <td className="p-2">{product.productName}</td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={1} className="text-center text-gray-500 p-4">
                    Không tìm thấy topping
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Price Viewer */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="p-4 border-b font-semibold bg-gray-100">
            {selectedProduct
              ? `Giá topping: ${selectedProduct.productName}`
              : 'Chọn topping để xem giá'}
          </div>
          {selectedProduct ? (
            <div className="p-4 text-xl">
              {(() => {
                const sizeData = productSizes.find(
                  (ps) => ps.productId === selectedProduct.id && ps.size === -1
                );
                return sizeData
                  ? `${sizeData.price} đồng`
                  : 'Chưa có giá';
              })()}
            </div>
          ) : (
            <div className="p-4 text-gray-500">Chưa chọn topping nào.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Thêm giá topping</h2>
            <HandleCreateExtraSize onSuccess={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
