
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Propiedad = {
  id: number;
  titulo: string;
  descripcion?: string;
  direccion?: string;
  precio: number | string;
  moneda?: string;
  estado?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading, logout } = useAuth();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargandoPropiedades, setCargandoPropiedades] = useState(true);
  const [errorAPI, setErrorAPI] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    async function obtenerPropiedades() {
      try {
        setCargandoPropiedades(true);
        setErrorAPI("");

        const respuesta = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedades/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (respuesta.status === 401) {
          logout();
          router.replace("/login");
          return;
        }

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar las propiedades.");
        }

        const datos = await respuesta.json();
        const lista = Array.isArray(datos) ? datos : datos.results;

        if (!Array.isArray(lista)) {
          throw new Error(
            "La respuesta de la API no tiene el formato esperado."
          );
        }

        setPropiedades(lista);
      } catch (error) {
        setErrorAPI(
          error instanceof Error
            ? error.message
            : "Ocurrió un error al cargar las propiedades."
        );
      } finally {
        setCargandoPropiedades(false);
      }
    }

    obtenerPropiedades();
  }, [isAuthenticated, token, logout, router]);

  function cerrarSesion() {
    logout();
    router.replace("/login");
  }

  function formatearPrecio(propiedad: Propiedad) {
    const moneda = propiedad.moneda || "ARS";

    try {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: moneda,
        maximumFractionDigits: 0,
      }).format(Number(propiedad.precio));
    } catch {
      return `${moneda} ${Number(propiedad.precio).toLocaleString("es-AR")}`;
    }
  }

  const disponibles = propiedades.filter(
    (propiedad) => propiedad.estado?.toLowerCase() === "disponible"
  ).length;

  const otrasSituaciones = propiedades.length - disponibles;

  if (isLoading || !isAuthenticated) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400">
          Verificando sesión...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800 dark:bg-slate-950 dark:text-white md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ENCABEZADO */}
        <header className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Inmobiliaria Riri
            </span>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Panel administrativo
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Bienvenido al espacio de gestión de la inmobiliaria.
            </p>
          </div>
          
        </header>

        {/* ESTADÍSTICAS */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total de propiedades
            </p>

            <p className="mt-3 text-4xl font-bold">
              {cargandoPropiedades ? "—" : propiedades.length}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Propiedades registradas
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Disponibles
            </p>

            <p className="mt-3 text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              {cargandoPropiedades ? "—" : disponibles}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Listas para ofrecer
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Otros estados
            </p>

            <p className="mt-3 text-4xl font-bold text-amber-600 dark:text-amber-400">
              {cargandoPropiedades ? "—" : otrasSituaciones}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              No disponibles
            </p>
          </article>
        </section>

        {/* GESTIÓN DE PROPIEDADES */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold">
                Gestión de propiedades
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Consultá y administrá las propiedades de la inmobiliaria.
              </p>
            </div>

            <Link
              href="/admin/propiedades/nueva"
              className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
            >
              + Nueva propiedad
            </Link>
          </div>

          {/* CARGANDO */}
          {cargandoPropiedades && (
            <div className="mt-8 space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          )}

          {/* ERROR */}
          {!cargandoPropiedades && errorAPI && (
            <div
              role="alert"
              className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            >
              {errorAPI}
            </div>
          )}

          {/* SIN PROPIEDADES */}
          {!cargandoPropiedades &&
            !errorAPI &&
            propiedades.length === 0 && (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 py-14 text-center dark:border-slate-700">
                <p className="text-lg font-semibold">
                  Todavía no hay propiedades
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Cuando registres una propiedad, aparecerá en esta sección.
                </p>

                <Link
                  href="/admin/propiedades/nueva"
                  className="mt-5 inline-block font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  Registrar primera propiedad →
                </Link>
              </div>
            )}

          {/* LISTADO */}
          {!cargandoPropiedades &&
            !errorAPI &&
            propiedades.length > 0 && (
              <div className="mt-8 space-y-4">
                {propiedades.map((propiedad) => (
                  <article
                    key={propiedad.id}
                    className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 p-5 transition hover:border-amber-400 hover:shadow-md dark:border-slate-700 dark:hover:border-amber-400 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold">
                        {propiedad.titulo}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        📍 {propiedad.direccion || "Sin dirección"}
                      </p>

                      <p className="mt-2 font-semibold text-amber-600 dark:text-amber-400">
                        {formatearPrecio(propiedad)}
                      </p>

                      <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {propiedad.estado || "Sin especificar"}
                      </span>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-3">
                      <Link
                        href={`/propiedades/${propiedad.id}`}
                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/admin/propiedades/${propiedad.id}/editar`}
                        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
                      >
                        Editar →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>

        {/* PIE DEL PANEL */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Panel de administración · Inmobiliaria Riri
        </p>
      </div>
    </main>
  );
}
