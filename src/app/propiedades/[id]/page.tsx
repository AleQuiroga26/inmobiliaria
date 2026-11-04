
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Barrio = {
  id: number;
  nombre: string;
  ciudad: string;
};

type TipoPropiedad = {
  id: number;
  nombre: string;
};

type Caracteristica = {
  id: number;
  nombre: string;
};

type Propiedad = {
  id: number;
  titulo: string;
  descripcion: string;
  direccion: string;
  operacion: string;
  precio: number | string;
  moneda: string;
  superficie_m2: number;
  ambientes: number;
  dormitorios: number;
  banios: number;
  cocheras: number;
  estado: string;
  foto: string | null;
  fecha_publicacion: string;
  barrio: number | Barrio;
  tipo: number | TipoPropiedad;
  propietario: number;
  agente: number;
  caracteristicas: Caracteristica[];
};

export default function DetallePropiedadPage() {
  const params = useParams();
  const id = params.id as string;

  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPropiedad() {
      try {
        const respuesta = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedades/${id}/`
        );

        if (respuesta.status === 404) {
          throw new Error("No encontramos esta propiedad.");
        }

        if (!respuesta.ok) {
          throw new Error("No se pudo cargar la propiedad.");
        }

        const datos = await respuesta.json();
        setPropiedad(datos);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error inesperado."
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPropiedad();
  }, [id]);

  function precioFormateado() {
    if (!propiedad) return "";

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: propiedad.moneda || "ARS",
      maximumFractionDigits: 0,
    }).format(Number(propiedad.precio));
  }

  function obtenerNombreBarrio() {
    if (!propiedad) return "";

    if (typeof propiedad.barrio === "object") {
      return `${propiedad.barrio.nombre}, ${propiedad.barrio.ciudad}`;
    }

    return `Barrio #${propiedad.barrio}`;
  }

  function obtenerNombreTipo() {
    if (!propiedad) return "";

    if (typeof propiedad.tipo === "object") {
      return propiedad.tipo.nombre;
    }

    return `Tipo #${propiedad.tipo}`;
  }

  return (
    <section className="min-h-screen bg-riri-light px-6 py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/propiedades"
          className="mb-8 inline-block font-semibold text-riri-gold transition hover:underline"
        >
          ← Volver a propiedades
        </Link>

        {cargando && (
          <p className="py-16 text-center text-slate-600 dark:text-slate-300">
            Cargando información de la propiedad...
          </p>
        )}

        {error && (
          <div className="rounded-xl bg-white p-8 text-center dark:bg-slate-800">
            <p role="alert" className="text-red-500">
              {error}
            </p>

            <Link
              href="/propiedades"
              className="mt-5 inline-block rounded-lg bg-riri-navy px-5 py-3 font-semibold text-white"
            >
              Volver al catálogo
            </Link>
          </div>
        )}

        {!cargando && !error && propiedad && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

            {/* Imagen */}
            {propiedad.foto ? (
              <img
                src={propiedad.foto}
                alt={propiedad.titulo}
                className="h-72 w-full object-cover md:h-96"
              />
            ) : (
              <div className="flex h-72 items-center justify-center bg-gradient-to-br from-riri-navy to-riri-blue md:h-96">
                <span className="text-8xl text-white">⌂</span>
              </div>
            )}

            <div className="p-6 md:p-10">

              {/* Título y precio */}
              <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div>
                  <span className="font-semibold uppercase tracking-widest text-riri-gold">
                    {propiedad.operacion}
                  </span>

                  <h1 className="mt-2 text-3xl font-bold text-riri-navy dark:text-white md:text-4xl">
                    {propiedad.titulo}
                  </h1>

                  <p className="mt-3 text-slate-500 dark:text-slate-400">
                    📍 {propiedad.direccion}
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-riri-gold">
                    {precioFormateado()}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {propiedad.estado}
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-riri-navy dark:text-white">
                  Descripción
                </h2>

                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                  {propiedad.descripcion || "Sin descripción disponible."}
                </p>
              </div>

              {/* Características */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-riri-navy dark:text-white">
                  Características
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-riri-light p-4 dark:bg-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      Superficie
                    </p>
                    <p className="mt-1 font-bold text-riri-navy dark:text-white">
                      {propiedad.superficie_m2} m²
                    </p>
                  </div>

                  <div className="rounded-lg bg-riri-light p-4 dark:bg-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      Ambientes
                    </p>
                    <p className="mt-1 font-bold text-riri-navy dark:text-white">
                      {propiedad.ambientes}
                    </p>
                  </div>

                  <div className="rounded-lg bg-riri-light p-4 dark:bg-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      Dormitorios
                    </p>
                    <p className="mt-1 font-bold text-riri-navy dark:text-white">
                      {propiedad.dormitorios}
                    </p>
                  </div>

                  <div className="rounded-lg bg-riri-light p-4 dark:bg-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      Baños
                    </p>
                    <p className="mt-1 font-bold text-riri-navy dark:text-white">
                      {propiedad.banios}
                    </p>
                  </div>

                  <div className="rounded-lg bg-riri-light p-4 dark:bg-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      Cocheras
                    </p>
                    <p className="mt-1 font-bold text-riri-navy dark:text-white">
                      {propiedad.cocheras}
                    </p>
                  </div>

                  <div className="rounded-lg bg-riri-light p-4 dark:bg-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      Tipo
                    </p>
                    <p className="mt-1 font-bold text-riri-navy dark:text-white">
                      {obtenerNombreTipo()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ubicación y características adicionales */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-riri-navy dark:text-white">
                  Ubicación
                </h2>

                <p className="mt-3 text-slate-600 dark:text-slate-300">
                  {obtenerNombreBarrio()}
                </p>
              </div>

              {propiedad.caracteristicas?.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-riri-navy dark:text-white">
                    Características adicionales
                  </h2>

                  <ul className="mt-3 list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                    {propiedad.caracteristicas.map((caracteristica) => (
                      <li key={caracteristica.id}>
                        {caracteristica.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
