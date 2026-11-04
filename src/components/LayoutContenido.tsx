"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutContenido({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const esLogin = pathname === "/login";

  if (esLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </>
  );
}
