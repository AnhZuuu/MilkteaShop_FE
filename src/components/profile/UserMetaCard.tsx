"use client";
import { useEffect, useState } from "react";
import { UpdateUserModal } from "./HandleUpdateInfor";
import { ChangePasswordModal } from "./HandleChangePassword";

interface Props {
  userId: string;
}

export default function UserMetaCard({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const roleMap: { [key: string]: string } = {
    "0": "Admin",
    "1": "Manager",
    "2": "Staff",
  };

  useEffect(() => {
    if (!userId || user) return;
    
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/User/${userId}`
        );
        const data = await response.json();
        console.log("Fetched user information:", data);
        setUser(data);
      } catch (error) {
        console.log("Error fetching user information:", error);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchStore = async () => {
      if (!user?.storeId) return;

      try {
        const response = await fetch(
          `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/${user.storeId}`
        );
        const data = await response.json();
        console.log("Fetched store:", data);
        setStore(data);
      } catch (error) {
        console.log("Error fetching store:", error);
      }
    };

    fetchStore();
  }, [user]);

  const handleUpdateClick = (user: User) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  return (
    <>
      {user && (
        <div>
          <div className="p-5 border border-gray-200 rounded-2xl">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full">
                  <img src={user.imageUrl} alt={user.username} />
                </div>
                <div className="order-3 xl:order-2">
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">
                    {user.username}
                  </h4>
                  <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className="text-sm text-gray-500">
                      {roleMap[user.role]}
                    </p>
                    <div className="h-3.5 w-px bg-gray-300"></div>
                    <p className="text-sm text-gray-500">
                      <span>
                        Chi nhánh cửa hàng:{" "}
                        <strong className="text-gray-600 dark:text-white">
                          {store?.storeName}
                        </strong>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex w-[20%] items-center justify-center gap-2 rounded-xl border border-gray-300 bg-green-100 px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-green-500 hover:text-gray-800l"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    fill=""
                  />
                </svg>
                Đổi mật khẩu
              </button>
            </div>
          </div>

          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:mt-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  Thông tin cá nhân
                </h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Tên người dùng
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {user.username}
                    </p>
                  </div>

                  <div></div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Địa chỉ Email
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Số điện thoại
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {user.phoneNumber}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Vị trí
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {roleMap[user.role]}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleUpdateClick(user)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    fill=""
                  />
                </svg>
                Sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <UpdateUserModal
          onClose={() => setShowUpdateModal(false)}
          user={user}
          setUser={setUser}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          user={user}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
}
