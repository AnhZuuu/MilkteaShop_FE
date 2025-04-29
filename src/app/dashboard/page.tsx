'use client';
import UserTable from "@/components/usersManagement/UserTable";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const adminPage = () => {
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
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <UserTable />
    </div>
  );
};

export default adminPage;
