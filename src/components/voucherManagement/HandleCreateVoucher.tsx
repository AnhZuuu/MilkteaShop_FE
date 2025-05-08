"use client";
import React, { useState } from "react";

interface HandleCreateVoucherProps {
  onClose: () => void;
  onVoucherCreated: (newVoucher: any) => void;
}

const HandleCreateVoucher: React.FC<HandleCreateVoucherProps> = ({
  onClose,
  onVoucherCreated,
}) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [priceCondition, setPriceCondition] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  const handleSubmit = async () => {
    if (!priceCondition || !discountPercentage) return;
    const newVoucher = {
      voucherCode,
      priceCondition,
      discountPercentage,
      isActive: true,
      exceedDate: new Date().toISOString()
    };

    console.log("voucher new: " + JSON.stringify(newVoucher));

    try {
      const res = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Voucher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newVoucher),
        }
      );

      if (!res.ok) {
        console.error("Server returned:", res.status);
        throw new Error("Lỗi tạo voucher");
      }

      const created = await res.json();
      onVoucherCreated(created);
    } catch (error) {
      console.error("Lỗi khi tạo voucher:", error);
    } finally {
      onClose();
      setPriceCondition(0);
      setDiscountPercentage(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-full space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Tạo mã giảm giá mới
          </h3>
          <p className="text-gray-600 text-sm">
            Nhập thông tin chi tiết để tạo một mã giảm giá.
          </p>
        </div>

        <form
          onSubmit={() => handleSubmit()}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="priceCondition"
                className="text-sm font-bold text-gray-700"
              >
                Điều kiện áp dụng (₫)
              </label>
              <input
                id="priceCondition"
                type="number"
                placeholder="Áp dụng cho đơn hàng có giá từ...."
                value={priceCondition}
                onChange={(e) => setPriceCondition(Number(e.target.value))}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="discountPercentage"
                className="text-sm font-bold text-gray-700"
              >
                Phần trăm giảm giá (%)
              </label>
              <input
                id="discountPercentage"
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandleCreateVoucher;
