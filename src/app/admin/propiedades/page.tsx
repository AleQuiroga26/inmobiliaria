
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BorrarPropiedad from "@/components/BorrarPropiedad";

type Propiedad = {
  id: number;
  titulo?: string;
  descripcion?: string;
  precio?: string | number;
};

export default function PropiedadesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    async function cargarPropiedades() {
      try {
        const respuesta = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedades/`,
          { cache: "no-store" }
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar las propiedades");
        }

        const datos = await respuesta.json();
        setPropiedades(datos.results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error desconocido"
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPropiedades();
  }, [isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return <p className="p-8">Verificando sesión...</p>;
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">
            Gestión de propiedades
          </h1>

          <Link
            href="/admin/propiedades/nueva"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
          >
            + Nueva propiedad
          </Link>
        </div>

        {error && (
          <p role="alert" className="mt-6 text-red-400">
            {error}
          </p>
        )}

        {cargando ? (
          <p className="mt-6">Cargando propiedades...</p>
        ) : propiedades.length === 0 ? (
          <p className="mt-6 text-zinc-400">
            No hay propiedades registradas todavía.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {propiedades.map((propiedad) => (
              <div
                key={propiedad.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-5"
              >
                <h2 className="text-xl font-semibold">
                  {propiedad.titulo ?? `Propiedad #${propiedad.id}`}
                </h2>

                <p className="mt-2 text-zinc-400">
                  {propiedad.descripcion}
                </p>

                <p className="mt-2">
                  Precio: ${propiedad.precio ?? "No disponible"}
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/admin/propiedades/${propiedad.id}/editar`}
                    className="rounded-lg bg-amber-600 px-4 py-2 font-semibold hover:bg-amber-700"
                  >
                    Editar
                  </Link>

                  <BorrarPropiedad
                    id={propiedad.id}
                    titulo={propiedad.titulo}
                    onBorrada={(id) =>
                      setPropiedades((actuales) =>
                        actuales.filter((p) => p.id !== id)
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
