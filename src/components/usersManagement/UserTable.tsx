"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import { FiEdit2, FiEye, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import { DeleteConfirmationModal, DeleteUserHandle } from "./HandleDeleteUser";
import { CreateUserModal } from "./HandleCreateUser";
import { UpdateUserModal } from "./HandleUpdateUser";

const roleMap: { [key: string]: string } = {
  "0": "Admin",
  "1": "Manager",
  "2": "Staff",
};

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [store, setStore] = useState<Store[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/User"
        );
        const data: User[] = await response.json();
        console.log("Fetched DATA:", data);
        setUsers([...users, ...data]);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store"
        );
        const dataStores: Store[] = await response.json();
        console.log("Fetched Stores:", dataStores);
        setStore(dataStores);
      } catch (error) {
        console.log("Error fetching stores:", error);
      }
    };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    fetchUsers();
    fetchStores();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.username?.includes(searchTerm);
      const matchesRole =
        roleFilter === "all" ||
        (typeof user.role === "number" && user.role === Number(roleFilter));
      const userStatus = user.isActive === true ? "Active" : "Block";
      const matchesStatus =
        statusFilter === "all" || userStatus === statusFilter;
      const matchesStore =
        storeFilter === "all" || user.storeId === storeFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesStore;
    });
  }, [users, searchTerm, roleFilter, statusFilter, storeFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateClick = (user: User) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FiPlus /> Tạo mới
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm người dùng..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="p-2 border rounded-lg"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Vai trò</option>
            <option value="0">Admin</option>
            <option value="1">Manager</option>
            <option value="2">Staff</option>
          </select>

          <select
            className="p-2 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Block">Chặn</option>
          </select>

          <select
            className="p-2 border rounded-lg"
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
          >
            <option value="all">Cửa hàng</option>
            {store.map((s) => (
              <option key={s.id} value={s.id}>
                {s.storeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              {[
                { key: "Image", label: "Hình ảnh" },
                { key: "Username", label: "Tên người dùng" },
                { key: "Email", label: "Email" },
                { key: "PhoneNumber", label: "Số điện thoại" },
                { key: "Role", label: "Vai trò" },
                { key: "Store", label: "Cửa hàng" },
                { key: "Status", label: "Trạng thái" },
                // { key: "CreatedAt", label: "Created Date" },
                { key: "UpdatedAt", label: "Ngày cập nhập" },
                // { key: "actions", label: "Actions" },
              ].map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => column.key !== "actions"}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((user, idx) => (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-10 h-10 overflow-hidden rounded-full">
                    <img
                      width={40}
                      height={40}
                      src={user.imageUrl}
                      alt={user.username}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {roleMap[user.role]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {store.find((s) => s.id === user.storeId)?.storeName || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.isActive === true
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive === true ? "Hoạt động" : "Chặn"}
                  </span>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  {format(user.createdAt, "MMM dd, yyyy")}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* <div>{format(user.updatedAt, "MMM dd, yyyy")}</div> */}
                  {user.updatedAt && isValid(parseISO(user.updatedAt))
                    ? format(parseISO(user.updatedAt), "MMM dd, yyyy")
                    : "—"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isActive == true ? (
                    <div className="flex space-x-4">
                      {/* <button
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FiEye className="w-5 h-5" />
                      </button> */}

                      <button
                        className="text-green-600 hover:text-green-800"
                        title="Edit User"
                        onClick={() => handleUpdateClick(user)}
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <span className="text-sm text-gray-700">
            Hiển thị {(currentPage - 1) * pageSize + 1} đến{" "}
            {Math.min(currentPage * pageSize, filteredUsers.length)} của{" "}
            {filteredUsers.length} mục
          </span>
          <select
            className="border rounded-md p-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} mục
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
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
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          userInfo={userInfo}
          users={users}
          stores={store}
          setUsers={setUsers}
          onCreated={fetchUsers}
        />
      )}

      {showUpdateModal && selectedUser && (
        <UpdateUserModal
          onClose={() => setShowUpdateModal(false)}
          userInfo={userInfo}
          selectedUser={selectedUser}
          users={users}
          stores={store}
          setUsers={setUsers}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            DeleteUserHandle(
              selectedUser,
              users,
              setUsers,
              setShowDeleteModal,
              setSelectedUser
            );
          }}
        />
      )}
    </div>
  );
};

export default UserTable;
