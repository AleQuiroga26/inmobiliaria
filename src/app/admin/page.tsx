
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <p className="p-8">Verificando sesión...</p>;
  }

  function cerrarSesion() {
    logout();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Panel administrativo
          </h1>

          <button
            onClick={cerrarSesion}
            className="rounded-lg bg-red-600 px-4 py-2"
          >
            Cerrar sesión
          </button>
        </div>

        <p className="mt-6 text-zinc-400">
          Bienvenido al panel de Inmobiliaria Riri.
        </p>

        <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">
            Gestión de propiedades
          </h2>
          <p className="mt-2 text-zinc-400">
            Próximamente podrás crear, editar y eliminar propiedades.
          </p>
        </section>
      </div>
    </main>
  );
}
