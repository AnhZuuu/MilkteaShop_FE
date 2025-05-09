// src/app/login/layout.tsx

import AppHeader from "@/components/header/Header";

export default function MenuLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>      
            <AppHeader/>  
          {children}
        </body>
      </html>
    );
  }
  