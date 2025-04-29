"use client";
import { FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import React, { useEffect, useMemo, useState } from "react";
import { deleteProduct } from "./HandleDeleteProduct";
import HandleCreateProduct from "./HandleCreateProduct";

export interface Product {
    id: string;
    productName: string;
    description: string;
    categoryId: string;
    category: any;
    imageUrl: string | null;
    productType: string | null;
    productSizes: any[];
    isActive: boolean;
}

export interface Category {
    id: string;
    categoryName: string;
}

const ProductTable = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;



    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.productName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const productStatus = product.isActive ? "Active" : "Block";
            const matchesStatus = statusFilter === "all" || productStatus === statusFilter;

            const matchesCategory = categoryFilter === null || product.categoryId === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [products, searchTerm, statusFilter, categoryFilter]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredProducts.slice(start, start + pageSize);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    const getCategoryName = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.categoryName : "Unknown";
    };

    const handleCategoryClick = (categoryId: string) => {
        setCategoryFilter(categoryId);
        setCurrentPage(1);
    };

    const clearCategoryFilter = () => {
        setCategoryFilter(null);
    };

    return (
        <div className="mx-auto max-w-5xl p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative md:basis-2/5 w-full">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="md:basis-1/5 w-full">
                    <select
                        className="p-2 border rounded-lg"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Trạng thái</option>
                        <option value="Active">Còn hàng</option>
                        <option value="Block">Tạm hết</option>
                    </select>
                </div>
                <div className="md:basis-1/5 w-full">
                    <select
                        className="p-2 border rounded-lg"
                        value={categoryFilter || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setCategoryFilter(value === "" ? null : value);
                            setCurrentPage(1); // reset to page 1 when changing filter
                        }}
                    >
                        <option value="">Tất cả loại sản phẩm</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="md:basis-1/5 w-full">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                    >
                        <FiPlus /> Tạo mới
                    </button>
                </div>
            </div>

            {categoryFilter && (
                <div className="mb-4">
                    <span className="text-gray-700">Lọc theo loại sản phẩm: </span>
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={clearCategoryFilter}
                    >
                        {getCategoryName(categoryFilter)} (bấm để xóa)
                    </button>
                </div>
            )}

            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Tên</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Mô tả</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Loại sản phẩm</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái</th>
                        <th className="border border-gray-300 px-4 py-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedProducts.map((product, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{product.productName}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.description}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => handleCategoryClick(product.categoryId)}
                                >
                                    {getCategoryName(product.categoryId)}
                                </button>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {product.isActive ? "Còn hàng" : "Tạm hết"}
                                </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <div className="flex space-x-4">
                                    <button className="text-blue-600 hover:text-blue-800" title="View Product">
                                        <FiEye className="w-5 h-5" />
                                    </button>
                                    <button className="text-green-600 hover:text-green-800" title="Edit Product">
                                        <FiEdit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete Product"
                                        onClick={() => {
                                            const confirmDelete = window.confirm("Are you sure you want to delete this product?");
                                            if (confirmDelete) {
                                                deleteProduct(product.id, products, setProducts);
                                            }
                                        }}
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-6 flex justify-between">
                <button
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                >
                    Quay lại
                </button>
                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-1 border rounded-md ${currentPage === page ? "bg-blue-500 text-white" : ""
                                }`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                >
                    Trang kế
                </button>
            </div>
            {showCreateModal && (
                <HandleCreateProduct
                    userInfo={userInfo}
                    onProductCreated={(newProduct) =>
                        setProducts((prev) => [...prev, newProduct])
                    }
                    onClose={() => setShowCreateModal(false)}
                />
            )}

        </div>
    );
};

export default ProductTable;
