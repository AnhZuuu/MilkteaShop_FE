// HandleCreateUser.tsx
import React, { useState } from "react";

interface CreateUserModalProps {
  onClose: () => void;
  userInfo: any;
  users: any[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, userInfo, users, setUsers }) => {
  const [formData, setFormData] = useState({
    Username: "",
    PasswordHash: "",
    Email: "",
    PhoneNumber: "",
    ImageUrl: "",
    Role: "Staff",
    IsActive: true,
  });

  const setIdUser = (Role: any) => {
    if (Role === "Admin") return "A" + (users.length + 1);
    if (Role === "Manager") return "M" + (users.length + 1);
    return "S" + (users.length + 1);
  };

  const handleCreateUser = async () => {
    const generatedId = setIdUser(formData.Role);
    const newUser = {
      ...formData,
      Id: generatedId,
      CreatedAt: new Date(),
      CreatedBy: userInfo?.Username || null,
      UpdatedAt: new Date(),
      DeletedAt: new Date(),
    };

    try {
      const response = await fetch("https://6804e5fd79cb28fb3f5c1a6d.mockapi.io/swp391/Users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers([...users, data]);
        onClose();
      } else {
        const error = await response.json();
        console.error("Error creating user:", error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New User</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateUser();
          }}
        >
          <div className="space-y-4">
            {["Username", "PasswordHash", "Email", "PhoneNumber", "ImageUrl"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{field}</label>
                <input
                  type={field === "PasswordHash" ? "password" : "text"}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  value={(formData as any)[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                value={formData.Role}
                onChange={(e) => setFormData({ ...formData, Role: e.target.value })}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-between space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 w-1/3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 w-1/3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
