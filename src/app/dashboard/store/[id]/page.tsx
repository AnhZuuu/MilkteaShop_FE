import { notFound } from "next/navigation";
import { FaMapMarkerAlt, FaPhone, FaStore, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type Store = {
  id: string;
  storeName: string;
  description?: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
};

export default async function StoreDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(
    `https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Store/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const store: Store = await res.json();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 relative">
        <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[35px] border-l-transparent border-r-transparent border-b-blue-500"></div>

        <div className="flex items-center mb-6 gap-3">
          <FaStore className="text-blue-600 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800">{store.storeName}</h1>
        </div>

        <p className="text-gray-600 mb-4">{store.description || "Không có mô tả"}</p>

        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-gray-500 mt-1" />
            <span className="text-gray-700">{store.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-500" />
            <span className="text-gray-700">{store.phoneNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            {store.isActive ? (
              <>
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-700 font-medium">Đang hoạt động</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-gray-400" />
                <span className="text-gray-500">Đã đóng cửa</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
