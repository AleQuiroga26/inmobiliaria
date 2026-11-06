import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-3">
          <span className="font-bold text-slate-900 dark:text-white">
            Panel de administración
          </span>

          <nav className="flex gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/admin" className="hover:text-amber-600">
              Inicio
            </Link>
            <Link href="/admin/propiedades" className="hover:text-amber-600">
              Propiedades
            </Link>
          </nav>
        </div>
      </div>

      {children}
    </section>
  );
}
