"use client";
import React from "react";

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal = ({
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
      <h3 className="text-xl font-semibold mb-4">Xác nhận xóa tài khoản</h3>
      <p className="mb-6">Bạn thật sự muốn xóa tài khoản này?</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
);

const DeleteUserHandle = async (
  selectedUser: User | null,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  if (!selectedUser) return;
  console.log("Selected User:", JSON.stringify(users, null, 2));

  const updatedUser = {
    ...selectedUser,
    updatedAt: new Date().toISOString(),
    deletedAt: new Date().toISOString(), 
    isActive: false
  };

  console.log("User updated: " + JSON.stringify(updatedUser));

  try {
    const response = await fetch(
      `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/User/${selectedUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to delete user: ${errorDetails}`);
    }

    // Update the local state with the updated user data
    const updatedUsers = users.map((user : any) =>
      user.id === selectedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);

    setShowDeleteModal(false);
    setSelectedUser(null);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export { DeleteUserHandle, DeleteConfirmationModal };
