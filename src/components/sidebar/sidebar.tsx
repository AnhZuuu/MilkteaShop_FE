

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Quản lý người dùng" },
    { href: "/dashboard/product", label: "Quản lý sản phẩm" },
    { href: "/dashboard/category", label: "Quản lý loại sản phẩm" },
    { href: "/dashboard/order", label: "Quản lý đơn hàng" },
    { href: "/dashboard/store", label: "Quản lý cửa hàng" },
    { href: "/dashboard/mapping", label: "Quản lý Mapping" },
    { href: "/dashboard/mapping2", label: "Quản lý Mapping2" },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-4 bg-gray-100">
      {/* Logo */}
      <div className="text-2xl font-bold text-center">
        MyAppLogo
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 mt-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-lg shadow transition 
              ${pathname === link.href ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-200"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
