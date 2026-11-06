
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  filtrarPropiedades,
  obtenerNombreBarrio,
  type Propiedad,
} from "@/lib/propiedades";
import PropiedadCard from "@/components/PropiedadCard";

function CatalogoPropiedades() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const operacion = searchParams.get("operacion") ?? "";
  const tipo = searchParams.get("tipo") ?? "";

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [barrioSeleccionado, setBarrioSeleccionado] = useState("Todos");
  const [ordenPrecio, setOrdenPrecio] = useState("relevancia");

  // Cargar propiedades desde Django, con los filtros que vienen del inicio
  useEffect(() => {
    async function cargarPropiedades() {
      setCargando(true);
      setError("");

      const parametros = new URLSearchParams();
      if (operacion) parametros.set("operacion", operacion);
      if (tipo) parametros.set("tipo", tipo);

      try {
        const respuesta = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedades/?${parametros.toString()}`
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
  }, [operacion, tipo]);

  const nombreTipo = (propiedades[0] as { tipo?: { nombre?: string } } | undefined)
    ?.tipo?.nombre;

  // Obtener barrios disponibles
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

    if (operacion || tipo) {
      router.push("/propiedades");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* ENCABEZADO */}
      <section className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            Inmobiliaria Riri
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Encontrá una propiedad que se sienta como tu próximo hogar.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Explorá nuestras propiedades, compará opciones y encontrá
            el lugar ideal para vos y tu familia.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/20 px-4 py-2">
              Propiedades seleccionadas
            </span>
            <span className="rounded-full border border-white/20 px-4 py-2">
              Venta y alquiler
            </span>
            <span className="rounded-full border border-white/20 px-4 py-2">
              Córdoba, Argentina
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

        {/* TÍTULO DEL CATÁLOGO */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Nuestro catálogo
            </span>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Explorá las propiedades
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Utilizá los filtros para encontrar lo que estás buscando.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            {(operacion || tipo) && (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                {[
                  operacion === "alquiler" ? "Alquiler" : operacion ? "Venta" : "",
                  tipo ? nombreTipo ?? "Tipo seleccionado" : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {propiedadesFiltradas.length} propiedades encontradas
            </p>
          </div>
        </div>

        {/* PANEL DE FILTROS */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Buscar propiedades
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Combiná los filtros para encontrar mejores resultados.
              </p>
            </div>

            <span className="hidden rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 sm:block">
              Filtros
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {/* BUSCADOR */}
            <div>
              <label
                htmlFor="busqueda"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                ¿Qué estás buscando?
              </label>

              <input
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Título, dirección o descripción..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* BARRIO */}
            <div>
              <label
                htmlFor="barrio"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Ubicación
              </label>

              <select
                id="barrio"
                value={barrioSeleccionado}
                onChange={(e) => setBarrioSeleccionado(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              >
                {barrios.map((barrio) => (
                  <option key={barrio} value={barrio}>
                    {barrio === "Todos" ? "Todos los barrios" : barrio}
                  </option>
                ))}
              </select>
            </div>

            {/* ORDEN */}
            <div>
              <label
                htmlFor="orden"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Ordenar resultados
              </label>

              <select
                id="orden"
                value={ordenPrecio}
                onChange={(e) => setOrdenPrecio(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              >
                <option value="relevancia">Más relevantes</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t border-slate-100 pt-5 dark:border-slate-700">
            <button
              type="button"
              onClick={limpiarFiltros}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Limpiar filtros
            </button>
          </div>
        </section>

        {/* CARGANDO */}
        {cargando && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800"
              >
                <div className="h-56 bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >
            <p className="font-semibold">No pudimos cargar las propiedades.</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {/* SIN RESULTADOS */}
        {!cargando && !error && propiedadesFiltradas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-800">
            <span className="text-5xl">⌂</span>

            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              No encontramos propiedades
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Probá cambiando la búsqueda o quitando algunos filtros.
            </p>

            <button
              type="button"
              onClick={limpiarFiltros}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Ver todas las propiedades
            </button>
          </div>
        )}

        {/* TARJETAS DE PROPIEDADES */}
        {!cargando && !error && propiedadesFiltradas.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {propiedadesFiltradas.map((propiedad) => (
              <PropiedadCard key={propiedad.id} propiedad={propiedad} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={<p className="p-8 text-slate-500">Cargando propiedades...</p>}>
      <CatalogoPropiedades />
    </Suspense>
  );
}
