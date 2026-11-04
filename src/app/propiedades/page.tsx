"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  filtrarPropiedades,
  obtenerNombreBarrio,
  type Propiedad,
} from "@/lib/propiedades";

export default function PropiedadesPage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estados de búsqueda y filtros
  const [busqueda, setBusqueda] = useState("");
  const [barrioSeleccionado, setBarrioSeleccionado] = useState("Todos");
  const [ordenPrecio, setOrdenPrecio] = useState("relevancia");

  // Cargar propiedades desde Django
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

  // Formatear precio
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

  // Obtener los barrios disponibles
  const barrios = useMemo(() => {
    const nombres = propiedades
      .map((propiedad) => obtenerNombreBarrio(propiedad.barrio))
      .filter((barrio) => barrio !== "");

    return ["Todos", ...new Set(nombres)];
  }, [propiedades]);

  // Aplicar búsqueda, barrio y orden de precio
  const propiedadesFiltradas = useMemo(() => {
    const resultado = filtrarPropiedades(
      propiedades,
      busqueda,
      barrioSeleccionado
    );

    // Ordenar por precio
    if (ordenPrecio === "menor") {
      resultado.sort(
        (a, b) =>
          Number(a.precio ?? Infinity) - Number(b.precio ?? Infinity)
      );
    }

    if (ordenPrecio === "mayor") {
      resultado.sort(
        (a, b) =>
          Number(b.precio ?? -Infinity) - Number(a.precio ?? -Infinity)
      );
    }

    return resultado;
  }, [propiedades, busqueda, barrioSeleccionado, ordenPrecio]);

  // Limpiar filtros
  function limpiarFiltros() {
    setBusqueda("");
    setBarrioSeleccionado("Todos");
    setOrdenPrecio("relevancia");
  }

  return (
    <section className="min-h-screen bg-riri-light px-6 py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">

        {/* Encabezado */}
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

        {/* Búsqueda y filtros */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="grid gap-4 md:grid-cols-3">

            {/* Buscador */}
            <div>
              <label
                htmlFor="busqueda"
                className="mb-2 block text-sm font-semibold text-riri-navy dark:text-white"
              >
                Buscar propiedad
              </label>

              <input
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Título, dirección o descripción..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-riri-gold focus:ring-2 focus:ring-riri-gold/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Filtro por barrio */}
            <div>
              <label
                htmlFor="barrio"
                className="mb-2 block text-sm font-semibold text-riri-navy dark:text-white"
              >
                Barrio
              </label>

              <select
                id="barrio"
                value={barrioSeleccionado}
                onChange={(e) => setBarrioSeleccionado(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-riri-gold dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              >
                {barrios.map((barrio) => (
                  <option key={barrio} value={barrio}>
                    {barrio}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar por precio */}
            <div>
              <label
                htmlFor="orden"
                className="mb-2 block text-sm font-semibold text-riri-navy dark:text-white"
              >
                Ordenar por precio
              </label>

              <select
                id="orden"
                value={ordenPrecio}
                onChange={(e) => setOrdenPrecio(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-riri-gold dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              >
                <option value="relevancia">Relevancia</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </div>
          </div>

          {/* Contador y botón limpiar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {propiedadesFiltradas.length} propiedades encontradas
            </p>

            <button
              type="button"
              onClick={limpiarFiltros}
              className="rounded-lg border border-riri-gold px-4 py-2 text-sm font-semibold text-riri-navy transition hover:bg-riri-gold hover:text-white dark:text-white"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Cargando */}
        {cargando && (
          <p className="py-10 text-center text-slate-600 dark:text-slate-300">
            Cargando propiedades...
          </p>
        )}

        {/* Error */}
        {error && (
          <p role="alert" className="py-10 text-center text-red-500">
            {error}
          </p>
        )}

        {/* Sin resultados */}
        {!cargando && !error && propiedadesFiltradas.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-slate-500 dark:bg-slate-800">
            No encontramos propiedades con esos filtros.
          </p>
        )}

        {/* Listado de propiedades */}
        {!cargando && !error && propiedadesFiltradas.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {propiedadesFiltradas.map((propiedad) => (
              <Link
                key={propiedad.id}
                href={`/propiedades/${propiedad.id}`}
                className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                {/* Imagen provisoria */}
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

                  {propiedad.barrio && (
                    <p className="mt-2 text-sm text-slate-500">
                      {obtenerNombreBarrio(propiedad.barrio)}
                      {typeof propiedad.barrio === "object" &&
                        `, ${propiedad.barrio.ciudad}`}
                    </p>
                  )}

                  {propiedad.superficie_m2 && (
                    <p className="mt-2 text-sm text-slate-500">
                      {propiedad.superficie_m2} m²
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
