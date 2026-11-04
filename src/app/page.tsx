
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Propiedad = {
  id: number;
  titulo?: string;
  descripcion?: string;
  precio?: number | string;
  direccion?: string;
  superficie_m2?: number;
};

export default function Home() {
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
        setPropiedades((datos.results ?? datos).slice(0, 3));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error inesperado"
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPropiedades();
  }, []);

  function formatearPrecio(precio?: number | string) {
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
    <div className="bg-riri-light dark:bg-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-riri-navy px-6 py-24 text-white md:py-36">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-riri-blue/40 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-riri-gold">
            Inmobiliaria Riri
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Encontrá el lugar donde comienza tu próxima historia.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Te acompañamos a encontrar tu próximo hogar.
            Descubrí propiedades y elegí el lugar ideal para vos.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/propiedades"
              className="rounded-lg bg-riri-gold px-7 py-4 font-bold text-riri-navy transition hover:bg-amber-400"
            >
              Explorar propiedades
            </Link>

            <Link
              href="/nosotros"
              className="rounded-lg border border-white/40 px-7 py-4 font-semibold transition hover:bg-white/10"
            >
              Conocé nuestra inmobiliaria
            </Link>
          </div>
        </div>
      </section>

      {/* PRESENTACIÓN */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <span className="font-semibold uppercase tracking-widest text-riri-gold">
            Encontrá tu lugar
          </span>

          <h2 className="mt-3 text-3xl font-bold text-riri-navy dark:text-white md:text-4xl">
            Tu próxima propiedad está más cerca.
          </h2>

          <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-300">
            Explorá nuestro catálogo de propiedades. Encontrá
            opciones para comprar o alquilar y descubrí nuevas
            oportunidades.
          </p>
        </div>
      </section>

      {/* PROPIEDADES DESTACADAS */}
      <section className="bg-white px-6 py-20 dark:bg-slate-800">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-semibold uppercase tracking-widest text-riri-gold">
                Nuestro catálogo
              </span>

              <h2 className="mt-2 text-3xl font-bold text-riri-navy dark:text-white">
                Propiedades destacadas
              </h2>
            </div>

            <Link
              href="/propiedades"
              className="font-semibold text-riri-blue hover:underline dark:text-riri-gold"
            >
              Ver todas las propiedades →
            </Link>
          </div>

          {cargando && (
            <p className="py-10 text-center text-slate-500">
              Cargando propiedades...
            </p>
          )}

          {error && (
            <p role="alert" className="py-10 text-center text-red-500">
              {error}
            </p>
          )}

          {!cargando && !error && propiedades.length === 0 && (
            <p className="py-10 text-center text-slate-500">
              Todavía no hay propiedades disponibles.
            </p>
          )}

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {propiedades.map((propiedad) => (
              <article
                key={propiedad.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-riri-light shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-riri-navy to-riri-blue">
                  <span className="text-6xl text-white/80">
                    ⌂
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-xl font-bold text-riri-gold">
                    {formatearPrecio(propiedad.precio)}
                  </p>

                  <h3 className="mt-3 text-lg font-bold text-riri-navy dark:text-white">
                    {propiedad.titulo ?? `Propiedad #${propiedad.id}`}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                    {propiedad.descripcion}
                  </p>

                  {propiedad.direccion && (
                    <p className="mt-3 text-sm text-slate-500">
                      📍 {propiedad.direccion}
                    </p>
                  )}

                  <Link
                    href={`/propiedades/${propiedad.id}`}
                    className="mt-6 block rounded-lg bg-riri-navy px-4 py-3 text-center font-semibold text-white transition hover:bg-riri-blue"
                  >
                    Ver propiedad
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="bg-riri-navy px-6 py-20 text-center text-white">
        <h2 className="text-3xl font-bold md:text-4xl">
          ¿Buscás tu próximo hogar?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          Explorá nuestro catálogo y encontrá una propiedad
          que se adapte a lo que necesitás.
        </p>

        <Link
          href="/propiedades"
          className="mt-8 inline-block rounded-lg bg-riri-gold px-8 py-4 font-bold text-riri-navy transition hover:bg-amber-400"
        >
          Ver catálogo
        </Link>
      </section>

    </div>
  );
}
  