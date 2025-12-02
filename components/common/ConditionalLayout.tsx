"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isInstructorRoute = pathname?.startsWith("/instructor");
  const isPathPlayerRoute = pathname?.startsWith("/path-player");

  return (
    <>
      {!isAdminRoute && !isInstructorRoute && !isPathPlayerRoute && <Navbar />}
      {children}
      {!isAdminRoute && !isInstructorRoute && !isPathPlayerRoute && <Footer />}
    </>
  );
}

