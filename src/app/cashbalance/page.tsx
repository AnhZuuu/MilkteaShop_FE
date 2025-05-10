"use client";
import StoreCard from "@/components/profile/StoreCard";
import UserMetaCard from "@/components/profile/UserMetaCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfiles() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.replace("/");
      } else {
        const parsedUser = JSON.parse(userData);
        console.log(parsedUser);
        setUser(parsedUser);
        setLoading(false);
      }
    }
  }, []);
  return (
    <div className="p-6 sm:p-12 space-y-10 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <div className="rounded-xl border border-gray-200 bg-white p-5 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7">
          Thông tin cửa hàng
        </h3>
        <div className="space-y-6">
          {user?.storeId && <StoreCard storeId={user.storeId} />}
        </div>
      </div>
    </div>
  );
}
