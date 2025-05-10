import React, { useState, useEffect } from "react";

interface UpdateUserModalProps {
  onClose: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction< User | null>>;
}

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  onClose,
  user,
  setUser,
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

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        passwordHash: user.passwordHash || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        imageUrl: user.imageUrl || "",
        role : Number(user.role) || 2,
        isActive: user.isActive ?? true,
        storeId: user.storeId || "",
      });
    }
  }, [user]);

  console.log("Selected User:", JSON.stringify(user, null, 2));

  const handleUpdateUser = async () => {
    const updatedUser = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/User/${user?.id}`,
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
        throw new Error(`Failed to update user: ${errorDetails}`);
      }

      console.log("User updated: " + JSON.stringify(updatedUser));
      const updateUserInfo = await response.json();
      setUser(updateUserInfo);
      onClose();
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-gray-500 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Cập nhật thông tin cá nhân
          </h3>
          <p className="text-gray-600 text-sm">Thay đổi thông tin cá nhân.</p>
        </div>
        <form onSubmit={handleUpdateUser} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="text-sm font-bold text-gray-700"
              >
                Tên người dùng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="categoryName"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                }}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="imageUrl"
                className="text-sm font-bold text-gray-700"
              >
                Hình ảnh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                }}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-row p-2">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-bold text-gray-700"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, phoneNumber: e.target.value });
                  }}
                  className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
