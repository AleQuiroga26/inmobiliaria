
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Propiedad = {
  id: number;
  titulo?: string;
  descripcion?: string;
  precio?: string | number;
};

export default function PropiedadesPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading } = useAuth();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

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

  async function eliminarPropiedad(id: number) {
    const confirmado = window.confirm(
      "¿Estás seguro de que querés eliminar esta propiedad?"
    );

    if (!confirmado) return;

    if (!token) {
      setError("Tu sesión no está disponible. Iniciá sesión nuevamente.");
      return;
    }

    setError("");
    setEliminandoId(id);

    try {
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/propiedades/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          `No se pudo eliminar la propiedad (HTTP ${respuesta.status})`
        );
      }

      setPropiedades((actuales) =>
        actuales.filter((propiedad) => propiedad.id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar"
      );
    } finally {
      setEliminandoId(null);
    }
  }

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

                  <button
                    type="button"
                    onClick={() => eliminarPropiedad(propiedad.id)}
                    disabled={eliminandoId !== null}
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700 disabled:opacity-50"
                  >
                    {eliminandoId === propiedad.id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
