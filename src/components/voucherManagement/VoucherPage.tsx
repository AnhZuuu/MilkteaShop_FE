import { useEffect, useState } from "react";
import { FaCheckCircle, FaTag, FaTimesCircle, FaTrash } from "react-icons/fa";
import HandleCreateVoucher from "./HandleCreateVoucher";
import {
  ConfirmDeleteVoucherModal,
  handleDeleteVoucher,
} from "./HandleDeleteVoucher";
import HandleUpdateVoucher from "./HandleUpdateVoucher";

const VoucherCard = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Voucher"
        );
        const data = await res.json();
        setVouchers(data);
      } catch (err) {
        console.error("Failed to fetch vouchers", err);
      }
    };

    fetchVouchers();
  }, []);

  const handleVoucherCreated = (newVoucher: Voucher) => {
    setVouchers((prev) => [...prev, newVoucher]);
  };

  const handleUpdateClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowDeleteModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">🎫 Danh sách Voucher 🎟️</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowCreateModal(true)}
      >
        ➕ Tạo voucher mới
      </button>

      {loading ? (
        <p>Đang tải voucher...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vouchers.map((voucher) => (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 max-w-md w-full hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between">
                {voucher.isActive ? (
                  <>
                    <span className="flex items-center text-green-600 text-sm">
                      <FaCheckCircle className="mr-1" /> Kích hoạt
                    </span>
                    <span className="flex items-center text-red-600 text-sm">
                      <FaTrash
                        className="mr-1"
                        onClick={() => handleDeleteClick(voucher)}
                      />
                    </span>
                  </>
                ) : (
                  <span className="flex items-center text-red-400 text-sm">
                    <FaTimesCircle className="mr-1" /> Ngưng hoạt động
                  </span>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-lg font-semibold text-blue-700 mb-1">
                    <FaTag className="mr-2 text-blue-500" />
                    {voucher.voucherCode}
                  </div>
                  <p className="bg-green-100 text-green-700">
                    Giảm {voucher.discountPercentage}%
                  </p>
                  <p className="text-gray-600 text-sm">
                    Đơn từ {voucher.priceCondition.toLocaleString()}₫
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Hết hạn: {new Date(voucher.exceedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-medium transition-all"
                onClick={() => handleUpdateClick(voucher)}
              >
                Chỉnh sửa
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <HandleCreateVoucher
          onClose={() => setShowCreateModal(false)}
          onVoucherCreated={handleVoucherCreated}
        />
      )}

      {showUpdateModal && selectedVoucher && (
        <HandleUpdateVoucher
          onClose={() => setShowUpdateModal(false)}
          selectedVoucher={selectedVoucher}
          vouchers={vouchers}
          setVouchers={setVouchers}
        />
      )}

      {showDeleteModal && selectedVoucher && (
        <ConfirmDeleteVoucherModal
          onConfirm={() => {
            handleDeleteVoucher(selectedVoucher.id, vouchers, setVouchers);
            setShowDeleteModal(false);
            setSelectedVoucher(null);
          }}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedVoucher(null);
          }}
        />
      )}
    </div>
  );
};

export default VoucherCard;
