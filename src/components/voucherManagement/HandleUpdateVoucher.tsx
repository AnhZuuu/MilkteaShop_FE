"use client";
import React, { useState } from "react";

interface HandleUpdateVoucherProps {
  onClose: () => void;
  selectedVoucher: Voucher;
  vouchers: Voucher[];
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>;
}

const HandleUpdateVoucher: React.FC<HandleUpdateVoucherProps> = ({
  onClose,
  selectedVoucher,
  vouchers,
  setVouchers,
}) => {
  const [voucherCode, setVoucherCode] = useState<string>(
    selectedVoucher.voucherCode
  );
  const [priceCondition, setPriceCondition] = useState<number>(
    selectedVoucher.priceCondition
  );
  const [discountPercentage, setDiscountPercentage] = useState<number>(
    selectedVoucher.discountPercentage
  );
  const [isActive, setIsActive] = useState<boolean>(selectedVoucher.isActive);
  const [exceedDate, setExceedDate] = useState<string>(
    selectedVoucher.exceedDate.slice(0, 10)
  );

  const handleSubmit = async () => {
    const updatedVoucher: Voucher = {
      ...selectedVoucher,
      voucherCode,
      priceCondition,
      discountPercentage,
      isActive,
      exceedDate,
    };

    try {
      const res = await fetch(
        `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Voucher/${selectedVoucher.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedVoucher),
        }
      );

      if (!res.ok) {
        console.error("Server returned:", res.status);
        throw new Error("Lỗi cập nhật voucher");
      }

      const updated = await res.json();

      // Update voucher list state
      setVouchers((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v))
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-full space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Cập nhật mã giảm giá
          </h3>
          <p className="text-gray-600 text-sm">
            Chỉnh sửa thông tin chi tiết và trạng thái của mã giảm giá.
          </p>
        </div>

        <form
          onSubmit={() => {
            handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <label
              htmlFor="voucherCode"
              className="text-sm font-bold text-gray-700"
            >
              Mã giảm giá
            </label>
            <input
              id="voucherCode"
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
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

          <div className="flex flex-col">
            <label
              htmlFor="exceedDate"
              className="text-sm font-bold text-gray-700"
            >
              Ngày hết hạn
            </label>
            <input
              id="exceedDate"
              type="date"
              value={exceedDate}
              onChange={(e) => setExceedDate(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md border">
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-800"
            >
              Trạng thái kích hoạt
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {isActive ? "Đang kích hoạt" : "Tạm ngưng"}
              </span>
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="toggle-checkbox hidden"
              />
              <div
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${
                  isActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* <div className="flex items-center space-x-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Kích hoạt voucher
            </label>
          </div> */}

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
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandleUpdateVoucher;
