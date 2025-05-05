'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StoreShowcase from "@/components/store/StorePage";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const userData = localStorage.getItem("user");
  //   if (!userData) {
  //     router.replace("/"); 
  //   } else {
  //     setUser(JSON.parse(userData));
  //     setLoading(false);
  //   }
  // }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <StoreShowcase/>
    </div>
  );
}
