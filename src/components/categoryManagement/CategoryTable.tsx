"use client";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import {
  ConfirmDeleteModal,
  HandleDeleteCategory,
  ValidationModal,
} from "./HandleDeleteCategory";
import HandleCreateCategory from "./HandleCreateCategory";
import HandleUpdateCategory from "./HandleUpdateCategory";

const CategoryTable = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [category, setCategory] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    const fetchCategory = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category"
        );
        const data = await res.json();
        setCategory(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product"
        );
        const products = await res.json();

        const counts: Record<string, number> = {};
        products.forEach((product: any) => {
          const catId = product.categoryId;
          counts[catId] = (counts[catId] || 0) + 1;
        });

        setProductCounts(counts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchCategory();
    fetchProducts();
  }, []);

  const filteredCategory = useMemo(() => {
    return category.filter((cate) => {
      const matchesSearch = cate.categoryName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const categoryStatus = cate.isActive === true ? "Active" : "Block";
      const matchesStatus =
        statusFilter === "all" || categoryStatus === statusFilter;

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

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowUpdateModal(true);
  };

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategory((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      if (productCounts[selectedCategory.id] > 0) {
        setShowDeleteModal(false);
        setShowValidationModal(true);
        return;
      } else {
        await HandleDeleteCategory(selectedCategory.id, category, setCategory);
      }
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Quản lý phân loại sản phẩm</h2>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="relative md:basis-3/5 w-full">
          <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:basis-1/5 w-full">
          <select
            className="w-full p-2 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Trạng thái</option>
            <option value="Active">Active</option>
            <option value="Block">Block</option>
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
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Tên loại
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Mô tả
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ngày cập nhập
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Sản phẩm
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Trạng thái
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
              {/* <td className="border border-gray-300 px-4 py-2">
                {cate.products?.length}
              </td> */}
              <td className="border border-gray-300 px-4 py-2">
                {productCounts[cate.id] || 0}
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
                  {/* <button
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <FiEye className="w-5 h-5" />
                  </button> */}

                  <button
                    className="text-green-600 hover:text-green-800"
                    title="Edit Category"
                    onClick={() => handleEditClick(cate)}
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Delete Category"
                    onClick={() => {
                      handleDeleteClick(cate);
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
      <div className="mt-6 flex justify-between">
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
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
          Trang tiếp theo
        </button>
      </div>

      {showCreateModal && (
        <HandleCreateCategory
          userInfo={userInfo}
          onCategoryCreated={(newCategory) =>
            setCategory((prev) => [...prev, newCategory])
          }
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showUpdateModal && editingCategory && (
        <HandleUpdateCategory
          category={editingCategory}
          userInfo={userInfo}
          onClose={() => setShowUpdateModal(false)}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}

      {showDeleteModal && selectedCategory && (
        <ConfirmDeleteModal
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showValidationModal && selectedCategory && (
        <ValidationModal onClose={() => setShowValidationModal(false)} />
      )}
    </div>
  );
};

export default CategoryTable;
