"use client";
import { FiEdit2, FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import React, { useEffect, useMemo, useState } from "react";
import { deleteProduct } from "./HandleDeleteProduct";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
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
            <h2 className="text-2xl font-bold mb-4">Product Management</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
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

                <select
                    className="p-2 border rounded-lg"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Block">Block</option>
                </select>
            </div>

            {categoryFilter && (
                <div className="mb-4">
                    <span className="text-gray-700">Filtering by Category: </span>
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={clearCategoryFilter}
                    >
                        {getCategoryName(categoryFilter)} (Clear)
                    </button>
                </div>
            )}

            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
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
                                    {product.isActive ? "Active" : "Block"}
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
                    Previous
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
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductTable;
