import { Suspense } from "react";
import PropiedadesDisponibles from "@/components/PropiedadesDisponibles";

export default function DestacadasPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Propiedades disponibles
      </h1>

      <div className="mt-8">
        <Suspense fallback={<p className="text-slate-500">Cargando propiedades...</p>}>
          <PropiedadesDisponibles />
        </Suspense>
      </div>
    </main>
  );
}
