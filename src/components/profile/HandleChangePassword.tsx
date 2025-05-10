import { useState } from "react";

interface ChangePasswordModalProps {
  user: User | null;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  user,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async () => {
    if (oldPassword !== user?.passwordHash) {
      setError("Mật khẩu cũ sai.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp.");
      return;
    }

    const updatedUser = {
      ...user,
      role: Number(user.role),
      passwordHash : newPassword
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
        const errorText = await response.text();
        setError(`Đổi mật khẩu thất bại. Vui lòng kiểm tra lại`);
        return;
      }

      setSuccess("Đổi mật khẩu thành công!");
      setError("");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Change password error:", err);
      setError("Lỗi mạng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>

        <div>
          <label className="text-sm">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="w-full border p-2 rounded mt-1"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full border p-2 rounded mt-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full border p-2 rounded mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};
