'use client';
import BillPage from "@/components/order/bill";
import { useEffect, useState } from "react";



export default function Bill() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);
  return (
    <>
      <BillPage />
    </>
  );
}