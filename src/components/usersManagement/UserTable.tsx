"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { FiEdit2, FiEye, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import { DeleteConfirmationModal, DeleteUserHandle } from "./HandleDeleteUser";
import { CreateUserModal } from "./HandleCreateUser";
import { UpdateUserModal } from "./HandleUpdateUser";

interface User {
  Id: string;
  Username: string;
  PasswordHash: string;
  Email: string;
  PhoneNumber: string;
  ImageUrl: string;
  Role: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
  CreatedBy: string;
}

//new interface
// interface User {
//   id: string;
//   username: string;
//   passwordHash: string;
//   email: string;
//   phoneNumber: string;
//   imageUrl: string;
//   role: string;
//   isActive: boolean;
//   orders : string[];
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: Date;
//   createdBy: string;
// }

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  const [formData, setFormData] = useState({
    Username: "",
    PasswordHash: "",
    Email: "",
    PhoneNumber: "",
    ImageUrl: "",
    Role: "Staff",
    IsActive: true,
  });

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://6804e5fd79cb28fb3f5c1a6d.mockapi.io/swp391/Users"
        );
        const data: User[] = await response.json();
        console.log("Fetched DATA:", data);
        setUsers(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.Role === roleFilter;

      const userStatus = user.IsActive === true ? "Active" : "Block";
      const matchesStatus =
        statusFilter === "all" || userStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

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
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <FiPlus /> Create User
        </button>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>

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
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              {[
                { key: "Id", label: "ID" },
                { key: "Username", label: "Username" },
                { key: "Email", label: "Email" },
                { key: "PhoneNumber", label: "Phone Number" },
                { key: "Role", label: "Role" },
                { key: "Status", label: "Status" },
                // { key: "CreatedAt", label: "Created Date" },
                { key: "UpdatedAt", label: "Updated Date" },
                { key: "actions", label: "Actions" },
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
                key={user.Id}
                className={`hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">{user.Id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={user.ImageUrl}
                        alt={user.Username}
                      />
                    </div>

                    {user.Username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.Email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.PhoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.Role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.IsActive === true
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.IsActive === true ? "Active" : "Block"}
                  </span>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  {format(user.CreatedAt, "MMM dd, yyyy")}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.IsActive == true ? (
                    <div>{format(user.UpdatedAt, "MMM dd, yyyy")}</div>
                  ) : (
                    <div>{format(user.DeletedAt, "MMM dd, yyyy")}</div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                {user.IsActive == true ? (
                  <div className="flex space-x-4">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    
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
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
            {filteredUsers.length} entries
          </span>
          <select
            className="border rounded-md p-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
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
            Previous
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
            Next
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          userInfo={userInfo}
          users={users}
          setUsers={setUsers}
        />
      )}

      {showUpdateModal && selectedUser && (
        <UpdateUserModal
          onClose={() => setShowUpdateModal(false)}
          userInfo={userInfo}
          selectedUser={selectedUser}
          users={users}
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
