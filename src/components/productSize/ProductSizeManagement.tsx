// components/ProductSizeManager.tsx

'use client';

import React, { useEffect, useState } from 'react';
import HandleCreateProductSize from './HandleCreateProductSize';
import HandleUpdateProductSize from './HandleUpdateProductSize';

type Product = {
  id: string;
  productName: string;
  productType: 'Main' | 'Extra' | null;
};

type ProductSize = {
  productId: string;
  size: 0 | 1 | 2;
  price: number;
};

const SIZE_LABELS = ['S', 'M', 'L'];

export default function ProductSizeManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOnlyUnpriced, setShowOnlyUnpriced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSize, setEditingSize] = useState<ProductSize | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, sizesRes] = await Promise.all([
        fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product'),
        fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize'),
      ]);

      const productsData: Product[] = await productsRes.json();
      const mainProducts = productsData.filter(
        (product) => product.productType === 'Main'
      );
      const sizesData = await sizesRes.json();

      setProducts(mainProducts);
      setProductSizes(sizesData);
    };

    fetchData();
  }, [showModal]); // refetch on modal close to show new data

  const productsWithNoSizePrices = products.filter(
    (product) =>
      !productSizes.some((ps) => ps.productId === product.id)
  );

  const filteredProducts = showOnlyUnpriced
    ? productsWithNoSizePrices
    : products;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý giá sản phẩm</h1>

      <div className="flex justify-between items-center">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOnlyUnpriced}
            onChange={(e) => setShowOnlyUnpriced(e.target.checked)}
            className="accent-blue-500"
          />
          <span>Sản phẩm chưa có giá</span>
        </label>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Thêm giá cho sản phẩm
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Product Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="p-4 border-b font-semibold bg-gray-100">
            Danh sách
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Tên</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100 text-center text-xl  "
                  onClick={() => setSelectedProduct(product)}>
                  <td className="p-2">{product.productName}</td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-gray-500 p-4">
                    Không tìm thấy sản phẩm
                  </td>
                </tr>
              )}
            </tbody>

            {/* <tbody>
              {[0, 1, 2].map((size) => {
                const sizeData = productSizes.find(
                  (ps) => ps.productId === selectedProduct.id && ps.size === size
                );

                return (
                  <tr key={size}>
                    <td className="p-2 text-xl">{SIZE_LABELS[size]}</td>
                    <td className="p-2 text-xl flex items-center gap-2">
                      {sizeData ? (
                        <>
                          <span>{sizeData.price} đồng</span>
                          <button
                            onClick={() => setEditingSize(sizeData)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Cập nhật
                          </button>
                        </>
                      ) : (
                        'Chưa có'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody> */}

          </table>
        </div>

        {/* Size Viewer */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="p-4 border-b font-semibold bg-gray-100">
            {selectedProduct
              ? `Giá theo kích thước của: ${selectedProduct.productName}`
              : 'Chọn sản phẩm'}
          </div>
          {selectedProduct ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">Size</th>
                  <th className="text-left p-2">Giá</th>
                </tr>
              </thead>

              {/* <tbody>
                {[0, 1, 2].map((size) => {
                  const sizeData = productSizes.find(
                    (ps) =>
                      ps.productId === selectedProduct.id && ps.size === size
                  );
                  return (
                    <tr key={size}>
                      <td className="p-2 text-xl">{SIZE_LABELS[size]}</td>
                      <td className="p-2 text-xl">
                        {sizeData ? `${sizeData.price} đồng` : 'Chưa cóa'}
                      </td>
                    </tr>
                  );
                })}
              </tbody> */}

              <tbody>
                {selectedProduct &&
                  [0, 1, 2].map((size) => {
                    const sizeData = productSizes.find(
                      (ps) => ps.productId === selectedProduct.id && ps.size === size
                    );

                    return (
                      <tr key={size}>
                        <td className="p-2 text-xl">{SIZE_LABELS[size]}</td>
                        <td className="p-2 text-xl flex items-center gap-2">
                          {sizeData ? (
                            <>
                              <span>{sizeData.price} đồng</span>
                              <button
                                onClick={() => setEditingSize(sizeData)}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                Cập nhật
                              </button>
                            </>
                          ) : (
                            'Chưa có'
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>


            </table>
          ) : (
            <div className="p-4 text-gray-500">Chưa chọn sản phẩm nào.</div>
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
            <h2 className="text-lg font-bold mb-4">Thêm giá cho sản phẩm theo kích thước</h2>
            <HandleCreateProductSize onSuccess={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {editingSize && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setEditingSize(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Cập nhật giá</h2>
            <HandleUpdateProductSize
              initialData={editingSize}
              onClose={() => setEditingSize(null)}
              onSuccess={() => {
                setShowModal(false); // This triggers refetch via useEffect
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
