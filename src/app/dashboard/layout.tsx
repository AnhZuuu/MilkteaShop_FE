
import SideBar from "@/components/sidebar/sidebar"; 

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <aside className="w-1/4 bg-gray-100 p-4">
            <SideBar />
          </aside>
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
