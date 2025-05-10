"use client";
import { useEffect, useState } from "react";

interface Props {
  storeId: string;
}

export default function StoreCard({ storeId }: Props) {
  const [store, setStore] = useState<Store | null>(null);
  const [moneyEarned, setMoneyEarned] = useState("");
  const [moneySubtracted, setMoneySubtracted] = useState("");

  const fetchStore = async () => {
    if (!storeId) return;

    try {
      const response = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/${storeId}`
      );
      const data = await response.json();
      console.log("Fetched store:", data);
      setStore(data);
    } catch (error) {
      console.log("Error fetching store:", error);
    }
  };
  useEffect(() => {
    fetchStore();
  }, [storeId]);

  const handleAddMoneyToCash = async () => {
    if (!moneyEarned) return;
    try {
      const url = new URL(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/add-money-to-cashbalance`
      );
      url.searchParams.append("id", storeId);
      url.searchParams.append("money", parseFloat(moneyEarned).toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMoneyEarned("");
      fetchStore();
    } catch (error) {
      console.error("Failed to add money:", error);
    }
  };

  const handleSubtractMoneyToCash = async () => {
    if (!moneySubtracted) return;
    try {
      const url = new URL(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/subtract-money-from-cashbalance`
      );
      url.searchParams.append("id", storeId);
      url.searchParams.append("money", parseFloat(moneySubtracted).toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMoneySubtracted("");
      fetchStore();
    } catch (error) {
      console.error("Failed to subtract money:", error);
    }
  };

  return (
    <>
      {store && (
        <div>
          <div className="p-5 border border-gray-200 rounded-2xl">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full">
                  <img src="/logo.png" alt="Logo" />
                </div>
                <div className="order-3 xl:order-2">
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">
                    {store.storeName}
                  </h4>
                  <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className="text-sm text-gray-500">{store.phoneNumber}</p>
                    <div className="h-3.5 w-px bg-gray-300"></div>
                    <p className="text-sm text-gray-500">
                      <span>{store.address}</span>
                    </p>
                  </div>
                  <h4 className="mb-2 text-md font-semibold text-gray-600">
                    {store.description}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:mt-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  Quản lý tiền trong kết ca
                </h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-md font-semibold leading-normal text-gray-500 dark:text-gray-400">
                      Tiền đầu ca
                    </p>
                    <p className="text-sm font-medium text-gray-800 bg-gray-100 p-2">
                      {store.cashBalance}
                    </p>
                  </div>

                  <div></div>

                  <div>
                    <p className="mb-2 text-md font-semibold leading-normal text-gray-500 dark:text-gray-400">
                      Tiền mặt kiếm được hôm nay
                    </p>
                    <input
                      value={moneyEarned}
                      onChange={(e) => setMoneyEarned(e.target.value)}
                      className="text-sm font-medium text-gray-800 bg-gray-100 p-2"
                      placeholder="Nhập số tiền thêm vào"
                      type="number"
                    />
                    <button
                      onClick={handleAddMoneyToCash}
                      className="m-2 px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Thêm tiền
                    </button>
                  </div>

                  <div>
                    <p className="mb-2 text-md font-semibold leading-normal text-gray-500 dark:text-gray-400">
                      Tiền trích ra từ két
                    </p>
                    <input
                      value={moneySubtracted}
                      onChange={(e) => setMoneySubtracted(e.target.value)}
                      type="number"
                      className="text-sm font-medium text-gray-800 bg-gray-100 p-2"
                      placeholder="Nhập số tiền trích ra"
                    />
                    <button
                      onClick={handleSubtractMoneyToCash}
                      className="m-2 px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Trừ tiền
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
