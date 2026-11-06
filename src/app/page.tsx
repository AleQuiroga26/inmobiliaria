"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PrecioPropiedad from "@/components/PrecioPropiedad";

type TipoPropiedad = {
  id: number;
  nombre: string;
};

type Propiedad = {
  id: number;
  titulo?: string;
  descripcion?: string;
  precio?: number | string;
  moneda?: string;
  direccion?: string;
  superficie_m2?: number;
};

const imagenes = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900",
];

export default function Home() {
  const router = useRouter();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [operacion, setOperacion] = useState("venta");
  const [tipo, setTipo] = useState("todos");
  const [tipos, setTipos] = useState<TipoPropiedad[]>([]);

  useEffect(() => {
    async function cargarTipos() {
      try {
        const respuesta = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tipos-propiedad/`
        );

        if (!respuesta.ok) return;

        const datos = await respuesta.json();
        setTipos(datos.results ?? datos);
      } catch {
        setTipos([]);
      }
    }

    cargarTipos();
  }, []);

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

  function buscarPropiedades() {
    const parametros = new URLSearchParams();

    parametros.set("operacion", operacion);

    if (tipo !== "todos") {
      parametros.set("tipo", tipo);
    }

    router.push(`/propiedades?${parametros.toString()}`);
  }

  return (
    <main className="bg-white text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">

      {/* PORTADA */}
      <section className="relative flex min-h-[650px] items-center bg-slate-900 px-6 py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20" />

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="max-w-3xl">
            <span className="font-semibold uppercase tracking-[0.25em] text-amber-400">
              Inmobiliaria Riri
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Encontrá el lugar donde comienza tu próxima historia.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">
              Te acompañamos a encontrar tu próximo hogar.
              Descubrí propiedades y elegí el lugar ideal para vos.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/propiedades"
                className="rounded-md bg-amber-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-amber-300"
              >
                Explorar propiedades →
              </Link>

              <Link
                href="/nosotros"
                className="rounded-md border border-white/60 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Conocé nuestra inmobiliaria
              </Link>
            </div>
          </div>

          {/* BUSCADOR */}
          <div className="mt-14 grid gap-4 rounded-xl bg-white p-5 shadow-2xl transition-colors dark:bg-slate-900 dark:shadow-black/30 md:grid-cols-[1fr_1fr_auto] md:items-end md:p-7">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                Operación
              </label>
              <select
                value={operacion}
                onChange={(e) => setOperacion(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="venta">Comprar</option>
                <option value="alquiler">Alquilar</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                Tipo de propiedad
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="todos">Todos los tipos</option>
                {tipos.map((opcion) => (
                  <option key={opcion.id} value={opcion.id}>
                    {opcion.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={buscarPropiedades}
              className="rounded-md bg-amber-400 px-8 py-3.5 font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Buscar propiedades →
            </button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="border-b border-slate-200 bg-[#faf8f4] px-6 py-8 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl gap-8 text-center md:grid-cols-3">
          <div>
            <span className="text-3xl">🤝</span>
            <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
              Atención personalizada
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Te acompañamos en cada paso.
            </p>
          </div>

          <div>
            <span className="text-3xl">🛡️</span>
            <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
              Transparencia
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Claridad durante todo el proceso.
            </p>
          </div>

          <div>
            <span className="text-3xl">⌂</span>
            <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
              Tu próximo hogar
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Encontramos el lugar ideal para vos.
            </p>
          </div>
        </div>
      </section>

      {/* PROPIEDADES DESTACADAS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                Nuestro catálogo
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                Propiedades destacadas
              </h2>

              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Descubrí algunas de nuestras oportunidades.
              </p>
            </div>

            <Link
              href="/propiedades"
              className="font-semibold text-slate-900 dark:text-white transition hover:text-amber-600 dark:hover:text-amber-400"
            >
              Ver todas las propiedades →
            </Link>
          </div>

          {cargando && (
            <p className="py-10 text-center text-slate-500 dark:text-slate-400">
              Cargando propiedades...
            </p>
          )}

          {error && (
            <p role="alert" className="py-10 text-center text-red-500">
              {error}
            </p>
          )}

          {!cargando && !error && propiedades.length === 0 && (
            <p className="py-10 text-center text-slate-500 dark:text-slate-400">
              Todavía no hay propiedades disponibles.
            </p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {propiedades.map((propiedad, indice) => (
              <article
                key={propiedad.id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30"
              >
                <div
                  className="relative h-64 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${imagenes[indice % imagenes.length]}')`,
                  }}
                >
                  <span className="absolute left-4 top-4 rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950">
                    Destacada
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    <PrecioPropiedad
                      precio={propiedad.precio}
                      moneda={propiedad.moneda}
                    />
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                    {propiedad.titulo ?? `Propiedad #${propiedad.id}`}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {propiedad.descripcion}
                  </p>

                  {propiedad.direccion && (
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      📍 {propiedad.direccion}
                    </p>
                  )}

                  {propiedad.superficie_m2 && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      ◫ {propiedad.superficie_m2} m²
                    </p>
                  )}

                  <Link
                    href={`/propiedades/${propiedad.id}`}
                    className="mt-6 block rounded-md bg-slate-900 px-4 py-3 text-center font-semibold text-white transition hover:bg-amber-500 hover:text-slate-950"
                  >
                    Ver propiedad →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="bg-[#faf8f4] px-6 py-20 transition-colors dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div
            className="min-h-[350px] rounded-xl bg-cover bg-center shadow-lg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200')",
            }}
          />

          <div>
            <span className="font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Sobre nosotros
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl">
              Tu confianza, nuestro compromiso.
            </h2>

            <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-300">
              En Inmobiliaria Riri trabajamos para ayudarte a encontrar
              la propiedad ideal, con un servicio cercano, profesional
              y transparente.
            </p>

            <Link
              href="/nosotros"
              className="mt-8 inline-block rounded-md bg-amber-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Conocé más sobre nosotros →
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              ¿Buscás tu próximo hogar?
            </h2>

            <p className="mt-4 max-w-xl text-slate-300">
              Explorá nuestro catálogo y encontrá una propiedad
              que se adapte a lo que necesitás.
            </p>
          </div>

          <Link
            href="/propiedades"
            className="rounded-md bg-amber-400 px-8 py-4 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Ver catálogo →
          </Link>
        </div>
      </section>

    </main>
  );
}