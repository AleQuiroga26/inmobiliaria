export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-riri-light px-6 dark:bg-slate-900">
      <div className="text-center">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-riri-gold" />

        <h1 className="text-xl font-bold text-riri-navy dark:text-white">
          Cargando...
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Estamos preparando la información para vos.
        </p>
      </div>
    </main>
  );
}
