
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-white">
      <h1 className="text-4xl font-bold">
        Inmobiliaria Riri
      </h1>

      <p className="mt-4 text-center text-zinc-400">
        Sistema de gestión inmobiliaria
      </p>

      <Link
        href="/login"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
      >
        Iniciar sesión
      </Link>
    </main>
  );
}
