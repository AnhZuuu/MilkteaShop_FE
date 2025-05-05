import React, { useState } from "react";

interface CreateUserModalProps {
  onClose: () => void;
  userInfo: any;
  users: any[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  stores: { id: string; storeName: string }[];
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  onClose,
  userInfo,
  users,
  setUsers,
  stores,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ storeId?: boolean }>({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    role: "Staff",
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

    if (name === "phoneNumber") {
      if (!/^0\d{9}$/.test(value)) {
        error = "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.";
      }
    }

    if (name === "storeId") {
      if (!value) {
        error = "Vui lòng chọn cửa hàng";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCreateUser = async () => {
    const newUser = {
      ...formData,
      createdAt: new Date().toISOString(),
      createdBy: userInfo?.username || null,
    };

    console.log("User inputed: " + JSON.stringify(newUser));

    try {
      const response = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/User/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers([...users, data]);
        onClose();
      } else {
        const error = await response.json();
        console.error("Error creating user:", error);
        setErrors({ general: error.message || "Tạo thất bại. Vui lòng thử lại." });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ general: "Đã xảy ra lỗi. Vui lòng thử lại." });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Tạo người dùng mới
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateUser();
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
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
                className={`mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
                value={formData.phoneNumber}
                onChange={(e) => {
                  setFormData({ ...formData, phoneNumber: e.target.value });
                }}
                onBlur={(e) => validateField("phoneNumber", e.target.value)}
                required
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
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
                onBlur={(e) => {
                  setTouched({ ...touched, storeId: true });
                  validateField("storeId", e.target.value);
                }}
              >
                <option value="">-- Chọn cửa hàng --</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.storeName}
                  </option>
                ))}
              </select>
              {touched.storeId && errors.storeId && (
                <p className="text-red-500 text-sm mt-1">{errors.storeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vai trò
              </label>
              <select
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="0">Admin</option>
                <option value="1">Manager</option>
                <option value="2">Staff</option>
              </select>
            </div>
          </div>

          {errors.general && (
            <p className="w-full text-center text-red-500 mt-2">
              {errors.general}
            </p>
          )}

          <div className="mt-6 flex justify-between space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 w-1/3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-6 py-3 w-1/3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
