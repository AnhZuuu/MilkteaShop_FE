

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "User Management" },
    { href: "/dashboard/product", label: "Quản lý sản phẩm" },
    { href: "/dashboard/category", label: "Category Management" },
    { href: "/dashboard/order", label: "Order Management" },
    { href: "/dashboard/store", label: "Store Management" },
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
