import Link from "next/link";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/login", label: "Ingresar" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">

        {/* IDENTIDAD */}
        <div>
          <Link href="/" className="inline-block">
            <h2 className="text-2xl font-bold tracking-tight">
              INMOBILIARIA <span className="text-amber-400">RIRI</span>
            </h2>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Te acompañamos a encontrar el lugar ideal para comenzar una nueva
            etapa. Descubrí propiedades y encontrá tu próximo hogar.
          </p>
        </div>

        {/* ENLACES */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-amber-400">
            Navegación
          </h3>

          <ul className="flex flex-col gap-3">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="text-sm text-slate-300 transition-colors hover:text-amber-400"
                >
                  {enlace.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* UBICACIÓN */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-amber-400">
            Ubicación
          </h3>

          <p className="text-sm leading-6 text-slate-300">
            Córdoba, Argentina
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Encontrá tu próximo hogar con nosotros.
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center text-xs text-slate-500 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Inmobiliaria Riri. Todos los derechos reservados.</p>
          <p>Desarrollado con dedicación en Córdoba, Argentina.</p>
        </div>
      </div>
    </footer>
  );
}
