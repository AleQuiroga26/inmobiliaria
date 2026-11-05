
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { obtenerImagenPropiedad } from "@/lib/imagenesPropiedades";

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
  precio: number | string | null;
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
        const api = process.env.NEXT_PUBLIC_API_URL;

        const [respuestaBarrio, respuestaTipo] = await Promise.all([
          typeof datos.barrio === "number"
            ? fetch(`${api}/barrios/${datos.barrio}/`)
            : null,
          typeof datos.tipo === "number"
            ? fetch(`${api}/tipos-propiedad/${datos.tipo}/`)
            : null,
        ]);

        const barrio =
          respuestaBarrio?.ok ? await respuestaBarrio.json() : datos.barrio;

        const tipo =
  respuestaTipo?.ok ? await respuestaTipo.json() : datos.tipo;

const caracteristicas = await Promise.all(
  (datos.caracteristicas ?? []).map(
    async (caracteristica: number | Caracteristica) => {
      if (typeof caracteristica === "object") {
        return caracteristica;
      }

      const id = caracteristica;
      const respuestaCaracteristica = await fetch(
        `${api}/caracteristicas/${id}/`
      );

      return respuestaCaracteristica.ok
        ? respuestaCaracteristica.json()
        : { id, nombre: `Característica #${id}` };
    }
  )
);

setPropiedad({
  ...datos,
  barrio,
  tipo,
  caracteristicas,
});
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

  // Formatear precio según la moneda recibida desde Django
  function precioFormateado() {
    if (!propiedad) return "Consultar precio";

    if (propiedad.precio === null || propiedad.precio === "") {
      return "Consultar precio";
    }

    const precio = Number(propiedad.precio);

    if (!Number.isFinite(precio) || precio <= 0) {
      return "Consultar precio";
    }

    const moneda = propiedad.moneda || "ARS";

    try {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: moneda,
        maximumFractionDigits: 0,
      }).format(precio);
    } catch {
      return `${moneda} ${precio.toLocaleString("es-AR")}`;
    }
  }

  function obtenerNombreBarrio() {
    if (!propiedad) return "";

    if (typeof propiedad.barrio === "object") {
      return `Barrio ${propiedad.barrio.nombre}`;
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

  const caracteristicasPrincipales = [
    {
      icono: "⌂",
      nombre: "Superficie",
      valor: `${propiedad?.superficie_m2 ?? 0} m²`,
    },
    {
      icono: "▦",
      nombre: "Ambientes",
      valor: propiedad?.ambientes ?? 0,
    },
    {
      icono: "🛏",
      nombre: "Dormitorios",
      valor: propiedad?.dormitorios ?? 0,
    },
    {
      icono: "▤",
      nombre: "Baños",
      valor: propiedad?.banios ?? 0,
    },
    {
      icono: "🚗",
      nombre: "Cocheras",
      valor: propiedad?.cocheras ?? 0,
    },
    {
      icono: "⌂",
      nombre: "Tipo",
      valor: obtenerNombreTipo(),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        {/* VOLVER AL CATÁLOGO */}
        <Link
          href="/propiedades"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-amber-600 dark:text-slate-300"
        >
          <span>←</span> Volver a propiedades
        </Link>

        {/* CARGANDO */}
        {cargando && (
          <div className="animate-pulse space-y-6">
            <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center dark:border-red-900 dark:bg-slate-800">
            <span className="text-5xl">⌂</span>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              No encontramos la propiedad
            </h2>

            <p role="alert" className="mt-3 text-red-500">
              {error}
            </p>

            <Link
              href="/propiedades"
              className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Volver al catálogo
            </Link>
          </div>
        )}

        {/* DETALLE */}
        {!cargando && !error && propiedad && (
          <div className="space-y-8">

            {/* IMAGEN PRINCIPAL */}
            <section className="relative overflow-hidden rounded-2xl bg-slate-900">
              <img
                src={
                  propiedad.foto || obtenerImagenPropiedad(propiedad.id)
                }
                alt={propiedad.titulo}
                className="h-[300px] w-full object-cover md:h-[480px]"
                onError={(evento) => {
                const imagenPorDefecto = obtenerImagenPropiedad(propiedad.id);

                if (evento.currentTarget.src !== imagenPorDefecto) {
                  evento.currentTarget.src = imagenPorDefecto;
                }
              }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950">
                  {propiedad.operacion}
                </span>

                <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold capitalize text-slate-800">
                  {propiedad.estado}
                </span>
              </div>
            </section>

            {/* INFORMACIÓN PRINCIPAL */}
            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

              <div className="space-y-8">

                {/* TÍTULO Y UBICACIÓN */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                    {obtenerNombreTipo()}
                  </span>

                  <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                    {propiedad.titulo}
                  </h1>

                  <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>📍</span>
                    {propiedad.direccion}
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ubicación
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                      {obtenerNombreBarrio()}
                    </p>
                  </div>
                </section>

                {/* DESCRIPCIÓN */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Descripción de la propiedad
                  </h2>

                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600 dark:text-slate-300">
                    {propiedad.descripcion ||
                      "No hay una descripción disponible para esta propiedad."}
                  </p>
                </section>

                {/* CARACTERÍSTICAS */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Características principales
                  </h2>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {caracteristicasPrincipales.map((caracteristica) => (
                      <div
                        key={caracteristica.nombre}
                        className="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/60"
                      >
                        <span className="text-2xl">
                          {caracteristica.icono}
                        </span>

                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">
                          {caracteristica.nombre}
                        </p>

                        <p className="mt-1 font-bold text-slate-900 dark:text-white">
                          {caracteristica.valor}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CARACTERÍSTICAS ADICIONALES */}
                {propiedad.caracteristicas?.length > 0 && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Características adicionales
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {propiedad.caracteristicas.map(
                        (caracteristica, index) => (
                          <span
                            key={`${caracteristica.id}-${index}`}
                            className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                          >
                            ✓ {caracteristica.nombre}
                          </span>
                        )
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* PANEL LATERAL */}
              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:sticky lg:top-28">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Precio de la propiedad
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {precioFormateado()}
                </p>

                <div className="my-6 border-t border-slate-100 dark:border-slate-700" />

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  ¿Te interesa esta propiedad?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Consultá por más información sobre esta propiedad.
                </p>

                <Link
                  href="/nosotros"
                  className="mt-6 block rounded-xl bg-slate-950 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-amber-600"
                >
                  Contactar inmobiliaria
                </Link>

                <Link
                  href="/propiedades"
                  className="mt-3 block rounded-xl border border-slate-300 px-5 py-4 text-center text-sm font-semibold text-slate-700 transition hover:border-amber-500 hover:text-amber-600 dark:border-slate-600 dark:text-slate-200"
                >
                  Ver más propiedades
                </Link>

                <p className="mt-6 text-center text-xs text-slate-400">
                  Código de propiedad: #{propiedad.id}
                </p>
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
