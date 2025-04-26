"use client";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import { deleteCategory } from "./HandleDeleteCategory";

// const transactions = [
//   {
//     name: "Bought PYPL",
//     date: "Nov 23, 01:00 PM",
//     price: "$2,567.88",
//     category: "Finance",
//     status: "Success",
//   },
//   {
//     name: "Bought AAPL",
//     date: "Nov 23, 01:00 PM",
//     price: "$2,567.88",
//     category: "Finance",
//     status: "Pending",
//   },
//   {
//     name: "Sell KKST",
//     date: "Nov 23, 01:00 PM",
//     price: "$2,567.88",
//     category: "Finance",
//     status: "Success",
//   },
//   {
//     name: "Bought FB",
//     date: "Nov 23, 01:00 PM",
//     price: "$2,567.88",
//     category: "Finance",
//     status: "Success",
//   },
//   {
//     name: "Sell AMZN",
//     date: "Nov 23, 01:00 PM",
//     price: "$2,567.88",
//     category: "Finance",
//     status: "Failed",
//   },
// ];

// const statusStyles = {
//   Success: "bg-green-200 text-green-600",
//   Pending: "bg-orange-200 text-orange-600",
//   Failed: "bg-red-200 text-red-600",
// };

export interface Category {
    id: string;
    categoryName: string;
    description: string;
    products: any[] | null;
    categoryExtraMappings: any[] | null;
    isActive: boolean;
    createdAt: Date; 
    updatedAt: Date; 
    deletedAt: Date | null;
    createdBy: string | null;
    updatedBy: string | null;
  }
  
const CategoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [category, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/Category/GetAll');
        const data = await res.json();
        setCategory(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
  
    fetchCategory();
  }, []);

  
  const filteredCategory = useMemo(() => {
    return category.filter((cate) => {
      const matchesSearch = cate.categoryName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = cate.isActive === true ? "Active" : "Block";
      return matchesSearch && matchesStatus;
    });
  }, [category, searchTerm, statusFilter]);

  const paginatedCategory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategory.slice(start, start + pageSize);
  }, [filteredCategory, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCategory.length / pageSize);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto max-w-4xl p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
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

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Product
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Status
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategory.map((cate, index) => (
            <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                {cate.categoryName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {cate.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div>{format(cate.updatedAt, "MMM dd, yyyy")}</div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {cate.products?.length}
              </td>
              <td className="border border-gray-300 px-4 py-2">
              <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      cate.isActive === true
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cate.isActive === true ? "Active" : "Block"}
                  </span>
              </td>
              <td className={`border border-gray-300 px-4 py-2`}>
                <div className="flex space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800"
                    title="Edit Category"
                    // onClick={() => handleUpdateClick(user)}
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Delete Category"
                    onClick={() => deleteCategory(cate.id, category, setCategory)}
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between">
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border rounded-md ${
                currentPage === page ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryTable;
