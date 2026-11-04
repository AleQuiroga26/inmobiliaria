import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-riri-light px-6 dark:bg-slate-900">
      <div className="max-w-md text-center">
        <p className="text-7xl font-bold text-riri-gold">404</p>

        <h1 className="mt-4 text-3xl font-bold text-riri-navy dark:text-white">
          Página no encontrada
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          La página que estás buscando no existe o fue movida.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-riri-gold px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
