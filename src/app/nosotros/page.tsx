import Link from "next/link";

const valores = [
  {
    numero: "01",
    titulo: "Confianza",
    descripcion:
      "Construimos relaciones transparentes, priorizando la tranquilidad de nuestros clientes en cada operación.",
  },
  {
    numero: "02",
    titulo: "Compromiso",
    descripcion:
      "Acompañamos a cada persona durante el proceso de compra, venta o alquiler de una propiedad.",
  },
  {
    numero: "03",
    titulo: "Cercanía",
    descripcion:
      "Escuchamos las necesidades de nuestros clientes para ayudarlos a encontrar la propiedad adecuada.",
  },
];

const pasos = [
  {
    numero: "01",
    titulo: "Nos conocemos",
    descripcion:
      "Nos contás qué estás buscando y cuáles son tus necesidades.",
  },
  {
    numero: "02",
    titulo: "Buscamos opciones",
    descripcion:
      "Te ayudamos a encontrar propiedades que se adapten a lo que necesitás.",
  },
  {
    numero: "03",
    titulo: "Te acompañamos",
    descripcion:
      "Estamos presentes durante el proceso para ayudarte a avanzar con tu operación.",
  },
];

export default function NosotrosPage() {
  return (
    <main className="bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 text-white md:py-32">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Inmobiliaria Riri
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Más que propiedades,
            <span className="block text-amber-400">
              acompañamos proyectos.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Somos Inmobiliaria Riri. Acompañamos a las personas y familias
            en la compra, venta y alquiler de propiedades, buscando que cada
            decisión sea una buena experiencia.
          </p>

          <Link
            href="/propiedades"
            className="mt-9 inline-flex rounded-lg bg-amber-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Conocé nuestras propiedades
          </Link>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Quiénes somos
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Tu próximo paso comienza con una buena decisión.
            </h2>

            <p className="mt-6 leading-relaxed text-slate-600 dark:text-slate-400">
              En Inmobiliaria Riri creemos que encontrar una propiedad es
              mucho más que elegir un lugar. Es encontrar un espacio donde
              comenzar una nueva etapa, desarrollar proyectos y construir
              sueños.
            </p>

            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
              Por eso, buscamos ofrecer una atención cercana y acompañar a
              nuestros clientes en cada etapa de sus operaciones
              inmobiliarias.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl border-2 border-amber-400/50" />

            <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-950 p-10 text-center">
              <div>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400 text-4xl text-slate-950">
                  R
                </div>

                <h3 className="mt-6 text-3xl font-bold text-white">
                  Inmobiliaria Riri
                </h3>

                <p className="mt-3 text-slate-300">
                  Encontrá el lugar para tu próxima historia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-slate-50 px-6 py-20 dark:bg-slate-900/60 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Lo que nos representa
            </span>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Nuestros valores
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Los principios que buscamos transmitir en cada operación.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {valores.map((valor) => (
              <article
                key={valor.numero}
                className="rounded-2xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <span className="text-4xl font-bold text-amber-500">
                  {valor.numero}
                </span>

                <h3 className="mt-6 text-xl font-bold">
                  {valor.titulo}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                  {valor.descripcion}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO TRABAJAMOS */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Nuestro acompañamiento
            </span>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              ¿Cómo trabajamos?
            </h2>

            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
              Queremos que el proceso sea claro y sencillo desde el primer
              contacto hasta concretar tu operación.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {pasos.map((paso, index) => (
              <div key={paso.numero} className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-amber-400 dark:bg-amber-400 dark:text-slate-950">
                  {paso.numero}
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {paso.titulo}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                  {paso.descripcion}
                </p>

                {index !== pasos.length - 1 && (
                  <div className="absolute left-16 top-7 hidden h-px w-[calc(100%-2rem)] bg-slate-200 dark:bg-slate-700 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 text-center text-white md:px-16 md:py-20">
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            Estamos para ayudarte
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold md:text-4xl">
            ¿Estás buscando tu próximo hogar?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-slate-300">
            Explorá nuestro catálogo y encontrá una propiedad que se adapte
            a tus necesidades.
          </p>

          <Link
            href="/propiedades"
            className="mt-8 inline-flex rounded-lg bg-amber-400 px-8 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Ver propiedades
          </Link>
        </div>
      </section>
    </main>
  );
}