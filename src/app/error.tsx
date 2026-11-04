"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-riri-light px-6 dark:bg-slate-900">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-riri-navy dark:text-white">
          ¡Ups! Algo salió mal
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Ocurrió un problema al cargar esta página. Podés intentar nuevamente.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-riri-gold px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Intentar nuevamente
        </button>
      </div>
    </main>
  );
}
