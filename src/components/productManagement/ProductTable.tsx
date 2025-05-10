"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiEye,
  FiPlus,
  FiSearch,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";
import HandleCreateProduct from "./HandleCreateProduct";
import HandleUpdateProduct, { Product } from "./HandleUpdateProduct";
import HandleSetPriceProduct from "./HandleSetPriceForProduct";

interface Category {
  id: string;
  categoryName: string;
}

const ProductTable = ({ userInfo }: { userInfo: any }) => {
  // const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [noPriceOnly, setNoPriceOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch(
            "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product"
            // { headers: { Authorization: `Bearer ${userInfo?.token}` } }
          ),
          fetch(
            "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category"
          ),
        ]);
        const [productData, categoryData] = await Promise.all([
          productRes.json(),
          categoryRes.json(),
        ]);
        setProducts(productData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [userInfo]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const productStatus = product.isActive ? "Active" : "Block";
      const matchesStatus =
        statusFilter === "all" || productStatus === statusFilter;

      const matchesCategory =
        categoryFilter === null || product.categoryId === categoryFilter;

      const matchesNoPrice = !noPriceOnly || product.productSizes.length === 0;

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesNoPrice
      );
    });
  }, [products, searchTerm, statusFilter, categoryFilter, noPriceOnly]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.categoryName : "Unknown";
  };

  const toggleProductStatus = async (product: Product) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn ${product.isActive ? "ẩn" : "hiển thị"} sản phẩm này?`
    );
    if (!confirm) return;

    const updatedProduct = { ...product, isActive: !product.isActive };

    try {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? updatedProduct : p))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      if (!res.ok) throw new Error("Delete failed");

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          <FiPlus />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative md:basis-2/5 w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="p-2 border rounded-lg md:basis-1/5"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="Active">Còn hàng</option>
          <option value="Block">Tạm hết</option>
        </select>
        <select
          className="p-2 border rounded-lg md:basis-1/5"
          value={categoryFilter || ""}
          onChange={(e) => {
            const value = e.target.value;
            setCategoryFilter(value === "" ? null : value);
            setCurrentPage(1);
          }}
        >
          <option value="">Tất cả loại sản phẩm</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="noPriceOnly"
            checked={noPriceOnly}
            onChange={(e) => setNoPriceOnly(e.target.checked)}
          />
          <label htmlFor="noPriceOnly" className="text-sm">
            Hiện thị sản phẩm chưa có giá
          </label>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Tên</th>
            <th className="border px-4 py-2 text-left">Mô tả</th>
            <th className="border px-4 py-2 text-left">Loại</th>
            <th className="border px-4 py-2 text-left">Trạng thái</th>
            <th className="border px-4 py-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.productName}</td>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2">
                {getCategoryName(product.categoryId)}
              </td>
              <td className="border px-4 py-2">
                <button
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  onClick={() => toggleProductStatus(product)}
                >
                  {product.isActive ? "Còn hàng" : "Tạm hết"}
                </button>
              </td>
              <td className="border px-4 py-2">
                <div className="flex space-x-3">
                  {product.productSizes.length > 0 ? (
                    <></>
                  ) : (
                    <div>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <FiSettings />
                      </button>
                    </div>
                  )}

                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => setEditProduct(product)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      const confirm = window.confirm("Xác nhận xóa sản phẩm?");
                      if (confirm) deleteProduct(product.id);
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Quay lại
        </button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border rounded-md ${
                currentPage === page ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Trang tiếp
        </button>
      </div>

      {showCreateModal && (
        <HandleCreateProduct
          userInfo={userInfo}
          onClose={() => setShowCreateModal(false)}
          onProductCreated={(newProduct) => {
            if (newProduct && newProduct.productName) {
              setProducts([...products, newProduct]);
            }
          }}
          
        />
      )}

      {selectedProduct && (
        <HandleSetPriceProduct
          userInfo={userInfo}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Edit Modal */}
      {editProduct && (
        <HandleUpdateProduct
          product={editProduct}
          userInfo={userInfo}
          onClose={() => setEditProduct(null)}
          onProductUpdated={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductTable;
