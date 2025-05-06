'use client';
import BillPage from "@/components/order/bill";
import { useEffect, useState } from "react";


const [width, setWidth] = useState(0);

useEffect(() => {
  if (typeof window !== "undefined") {
    setWidth(window.innerWidth);
  }
}, []);


export default function Bill() {
  return (
    <>
      <BillPage />
    </>
  );
}