'use client';
import BillPage from "@/components/order/bill";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";



export default function Bill() {
  const [width, setWidth] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/"); 
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
    
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);
  return (
    <>
      <Suspense fallback={<div className="text-white">Đang tải hoá đơn...</div>}>
      <BillPage />
    </Suspense>
    </>
  );
}