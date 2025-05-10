import React, { useState, useEffect } from "react";

interface UpdateUserModalProps {
  onClose: () => void;
  userInfo: any;
  selectedUser: any;
  users: any[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  stores: { id: string; storeName: string }[];
}

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  onClose,
  userInfo,
  selectedUser,
  users,
  setUsers,
  stores,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    username: "",
    passwordHash: "",
    email: "",
    phoneNumber: "",
    imageUrl: "",
    role: 2,
    isActive: true,
    storeId: "",
  });

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "username") {
      const exists = users.some((user) => user.username === value);
      if (exists) {
        error = "Tên người dùng đã tồn tại.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || "",
        passwordHash: selectedUser.passwordHash || "",
        email: selectedUser.email || "",
        phoneNumber: selectedUser.phoneNumber || "",
        imageUrl: selectedUser.imageUrl || "",
        role: selectedUser.role || 2,
        isActive: selectedUser.isActive ?? true,
        storeId: selectedUser.storeId || "",
      });
    }
  }, [selectedUser]);

  console.log("Selected User:", JSON.stringify(selectedUser, null, 2));

  const handleUpdateUser = async () => {
    const updatedUser = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

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

      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? updatedUser : user
      );

      console.log("User updated: " + JSON.stringify(updatedUsers));

      setUsers(updatedUsers);
      onClose();
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Thông tin người dùng
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser();
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên người dùng
              </label>
              <input
                type="text"
                className={`mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 ${
                  errors.username ? "border-red-500" : ""
                }`}
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                }}
                onBlur={(e) => validateField("username", e.target.value)}
                required
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                type="password"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                value={formData.passwordHash}
                onChange={(e) =>
                  setFormData({ ...formData, passwordHash: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="text"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hình ảnh
              </label>
              <input
                type="text"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cửa hàng
              </label>
              <select
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                value={formData.storeId}
                onChange={(e) =>
                  setFormData({ ...formData, storeId: e.target.value })
                }
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.storeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vai trò
              </label>
              <select
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: parseInt(e.target.value) })
                }
              >
                <option value="0">Admin</option>
                <option value="1">Manager</option>
                <option value="2">Staff</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-between space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 w-1/3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 w-1/3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Cập nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
