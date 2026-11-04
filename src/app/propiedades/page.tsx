"use client";

import { useEffect, useState } from "react";

type Propiedad = {
  id: number;
  titulo?: string;
  descripcion?: string;
  precio?: number | string;
  direccion?: string;
  superficie_m2?: number;
};

export default function PropiedadesPage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPropiedades() {
      try {
        const respuesta = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedades/`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar las propiedades");
        }

        const datos = await respuesta.json();
        setPropiedades(datos.results ?? datos);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error desconocido"
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPropiedades();
  }, []);

  function precioFormateado(precio?: number | string) {
    if (precio === undefined || precio === null) {
      return "Consultar precio";
    }

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Number(precio));
  }

  return (
    <section className="min-h-screen bg-riri-light px-6 py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <span className="font-semibold uppercase tracking-widest text-riri-gold">
            Inmobiliaria Riri
          </span>

          <h1 className="mt-3 text-4xl font-bold text-riri-navy dark:text-white">
            Nuestras propiedades
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Encontrá tu próximo hogar entre nuestras propiedades disponibles.
          </p>
        </div>

        {cargando && (
          <p className="py-10 text-center">Cargando propiedades...</p>
        )}

        {error && (
          <p role="alert" className="py-10 text-center text-red-500">
            {error}
          </p>
        )}

        {!cargando && !error && propiedades.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-slate-500 dark:bg-slate-800">
            Todavía no hay propiedades registradas.
          </p>
        )}

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {propiedades.map((propiedad) => (
            <article
              key={propiedad.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-riri-navy to-riri-blue">
                <span className="text-6xl text-white">⌂</span>
              </div>

              <div className="p-6">
                <p className="font-bold text-riri-gold">
                  {precioFormateado(propiedad.precio)}
                </p>

                <h2 className="mt-2 text-xl font-bold text-riri-navy dark:text-white">
                  {propiedad.titulo ?? `Propiedad #${propiedad.id}`}
                </h2>

                <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                  {propiedad.descripcion}
                </p>

                {propiedad.direccion && (
                  <p className="mt-3 text-sm text-slate-500">
                    📍 {propiedad.direccion}
                  </p>
                )}

                {propiedad.superficie_m2 && (
                  <p className="mt-2 text-sm text-slate-500">
                    {propiedad.superficie_m2} m²
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
