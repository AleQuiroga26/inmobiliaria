import Link from "next/link";
import { obtenerImagenPropiedad } from "@/lib/imagenesPropiedades";
import PrecioPropiedad from "@/components/PrecioPropiedad";

type Ciudad = { id: number; nombre: string; provincia?: string };

type PropiedadResumen = {
  id: number;
  titulo?: string;
  descripcion?: string;
  direccion?: string;
  precio?: number | string | null;
  moneda?: string;
  estado?: string;
  superficie_m2?: number;
  barrio?: { id: number; nombre: string; ciudad: Ciudad | string } | string;
};

function textoUbicacion(barrio: PropiedadResumen["barrio"]) {
  if (!barrio) return "";
  if (typeof barrio === "string") return barrio;
  const ciudad = typeof barrio.ciudad === "object" ? barrio.ciudad.nombre : barrio.ciudad;
  return ciudad ? `${barrio.nombre}, ${ciudad}` : barrio.nombre;
}

export default function PropiedadCard({ propiedad }: { propiedad: PropiedadResumen }) {
  const ubicacion = textoUbicacion(propiedad.barrio);

  return (
    <Link
      href={`/propiedades/${propiedad.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-700">
        <img
          src={obtenerImagenPropiedad(propiedad.id)}
          alt={propiedad.titulo ?? "Imagen de propiedad"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold capitalize text-slate-800">
          {propiedad.estado ?? "disponible"}
        </span>

        <span className="absolute bottom-4 right-4 rounded-lg bg-slate-950/70 px-3 py-2 text-xs font-semibold text-white">
          Ver detalles →
        </span>
      </div>

      <div className="p-6">
        <p className="text-lg font-bold text-amber-600">
          <PrecioPropiedad precio={propiedad.precio} moneda={propiedad.moneda} />
        </p>

        <h3 className="mt-2 text-xl font-bold text-slate-900 transition group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
          {propiedad.titulo ?? `Propiedad #${propiedad.id}`}
        </h3>

        {propiedad.direccion && (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            📍 {propiedad.direccion}
          </p>
        )}

        {propiedad.descripcion && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {propiedad.descripcion}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {ubicacion && <span>📌 {ubicacion}</span>}
          {propiedad.superficie_m2 && <span>📐 {propiedad.superficie_m2} m²</span>}
        </div>
      </div>
    </Link>
  );
}
