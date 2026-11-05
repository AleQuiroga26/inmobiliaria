"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-2xl text-amber-400">
            ⌂
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight tracking-tight text-slate-900">
              INMOBILIARIA <span className="text-amber-600">RIRI</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Encontrá tu próximo hogar
            </span>
          </div>
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {links.map((link) => {
              const activo =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative py-2 text-sm font-semibold transition-colors ${
                      activo
                        ? "text-amber-600"
                        : "text-slate-700 hover:text-amber-600"
                    }`}
                  >
                    {link.label}

                    {activo && (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-amber-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ACCESO AL PANEL ADMINISTRATIVO */}
          {!isLoading && isAuthenticated && (
            <Link
              href="/admin"
              className={`text-sm font-semibold transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-amber-600"
                  : "text-slate-700 hover:text-amber-600"
              }`}
            >
              Panel administrativo
            </Link>
          )}

          {/* TEMA Y AUTENTICACIÓN */}
          <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
            <ThemeToggle />

            {!isLoading && (
              isAuthenticated ? (
                <button
                  onClick={logout}
                  className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-md"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-600 hover:shadow-md"
                >
                  Ingresar
                </Link>
              )
            )}
          </div>
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-2xl text-slate-900 transition hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? "×" : "☰"}
        </button>
      </nav>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg md:hidden">
          <ul className="flex flex-col gap-2">
            {links.map((link) => {
              const activo =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      activo
                        ? "bg-amber-50 text-amber-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* ACCESO AL PANEL ADMINISTRATIVO */}
            {!isLoading && isAuthenticated && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-amber-50 text-amber-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Panel administrativo
                </Link>
              </li>
            )}

            {/* APARIENCIA */}
            <li className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-slate-700">
                Apariencia
              </span>
              <ThemeToggle />
            </li>

            {/* INGRESAR / CERRAR SESIÓN */}
            {!isLoading && (
              <li className="pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="block w-full rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Ingresar
                  </Link>
                )}
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}