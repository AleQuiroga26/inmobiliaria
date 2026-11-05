
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LayoutContenidoInterno({
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

export default function LayoutContenido({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LayoutContenidoInterno>{children}</LayoutContenidoInterno>
    </Suspense>
  );
}
