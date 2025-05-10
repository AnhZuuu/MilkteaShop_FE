"use client";
import React, { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { FaMapPin } from "react-icons/fa6";
import HandleCreateMapping from "./HandleCreateMapping";
import HandleUpdateMapping from "./HandleUpdateMapping";
import {
  ConfirmDeleteMappingModal,
  handleDeleteMapping,
} from "./HandleDeleteMapping";
import { HiOutlineDotsVertical } from "react-icons/hi";

// const sampleMappings: Mapping[] = [
//   {
//     id: "9d68f681-f727-4618-a151-cc5c4428076b",
//     mainCategoryId: "9bb11dd2-be35-474d-9b2f-3d4587c59594",
//     extraCategoryId: "11af5b3c-8817-4a18-b7e3-84bf8f1bba45",
//     mainCategoryName: "Trà Sữa",
//     extraCategoryName: "Topping trà sữa",
//     mainCategoryDescription: "Trà kết hợp với sữa",
//     extraCategoryDescription: "Topping kèm thêm cho trà sữa"
//   },
//   {
//     id: "214ef425-c858-4c89-8a0c-e09ee49dfa85",
//     mainCategoryId: "2eb20db9-830b-48fc-3acb-08dd84ad2fb8",
//     extraCategoryId: "faec319a-15ba-4dbe-03fb-08dd85f8fbdd",
//     mainCategoryName: "Coffee",
//     extraCategoryName: "Topping Coffee",
//     mainCategoryDescription: "Các loại coffee",
//     extraCategoryDescription: "Các loại topping cho coffee"
//   }
// ];

const CategoryMappingList: React.FC = () => {
  const [mappings, setMappings] = useState<categoryExtraMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/CategoryExtraMapping"
        );
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu liên kết danh mục");
        const data = await res.json();
        console.log("Fetched mappings:", data);
        setMappings(data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category"
        );
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách category:", err);
      }
    };

    fetchMappings();
    fetchCategories();
  }, []);

  const refreshMappings = async () => {
    const res = await fetch(
      "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/CategoryExtraMapping"
    );
    const data = await res.json();
    setMappings(data.data);
  };

  const confirmDelete = async () => {
    if (selectedMapping) {
      await handleDeleteMapping(selectedMapping, refreshMappings);
      setShowDeleteModal(false);
      setSelectedMapping(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Danh sách liên kết danh mục chính & topping
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Tạo mapping mới
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {mappings.map((map) => (
            <div
              key={map.id}
              className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
            >
              <div className="flex items-start gap-4">
                <FaMapPin className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {map.mainCategoryName}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {map.mainCategoryDescription}
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-dashed border-blue-400 my-4 ml-4 pl-4">
                <div className="flex items-start gap-3">
                  <FaCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">
                      {map.extraCategoryName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {map.extraCategoryDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute top-2 right-2">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === map.id ? null : map.id)
                  }
                  className="text-gray-500 hover:text-gray-700"
                >
                  <HiOutlineDotsVertical className="w-5 h-5" />
                </button>

                {openMenuId === map.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => {
                        setSelectedMapping(map.id);
                        setShowDeleteModal(true);
                        setOpenMenuId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMapping(map);
                        setShowUpdateModal(true);
                        setOpenMenuId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                    >
                      Cập nhật
                    </button>
                  </div>
                )}
              </div>

              {/* <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedMapping(map.id);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Xóa
                </button>
                <button
                  onClick={() => {
                    setSelectedMapping(map);
                    setShowUpdateModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Cập nhật
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <HandleCreateMapping
          categories={categories}
          onClose={() => setShowCreateModal(false)}
          onCreated={refreshMappings}
        />
      )}

      {showUpdateModal && selectedMapping && (
        <HandleUpdateMapping
          categories={categories}
          mapping={selectedMapping} // Pass the selected mapping for update
          onClose={() => setShowUpdateModal(false)}
          onUpdated={refreshMappings}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteMappingModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default CategoryMappingList;
