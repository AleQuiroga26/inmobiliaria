
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inmobiliaria Riri",
  description: "Encontrá tu próxima casa o departamento con Inmobiliaria Riri.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${geist.className} flex min-h-screen flex-col bg-riri-light text-slate-800 dark:bg-slate-900 dark:text-slate-100`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="w-full flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
