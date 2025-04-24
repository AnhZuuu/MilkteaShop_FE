"use client";
import React from 'react';

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
      <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
      <p className="mb-6">Are you sure you want to delete this user?</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
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

  const updatedUser = {
    ...selectedUser,
    DeletedAt: new Date(),
    IsActive: false,
  };

  try {
    const response = await fetch(
      `https://6804e5fd79cb28fb3f5c1a6d.mockapi.io/swp391/Users/${selectedUser.Id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    // Update the local state with the updated user data
    const updatedUsers = users.map((user) =>
      user.Id === selectedUser.Id ? updatedUser : user
    );
    setUsers(updatedUsers);

    setShowDeleteModal(false);
    setSelectedUser(null);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

export { DeleteUserHandle, DeleteConfirmationModal };
