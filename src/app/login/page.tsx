"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(1, "Ingresá tu usuario"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [errorAPI, setErrorAPI] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(datos: LoginForm) {
    setErrorAPI("");

    try {
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        }
      );

      if (!respuesta.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      const tokens = await respuesta.json();

      if (tokens.access && tokens.refresh) {
        login(tokens.access);
        router.push("/admin");
      } else {
        throw new Error("La API no devolvió los tokens esperados");
      }
    } catch (error) {
      setErrorAPI(
        error instanceof Error ? error.message : "Error de conexión"
      );
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">

      {/* Decoración del fondo */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Volver al inicio */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-400"
        >
          <span>←</span>
          Volver al inicio
        </Link>

        {/* Tarjeta de login */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-10"
        >

          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-3xl font-bold text-slate-950 shadow-lg shadow-amber-400/20">
              R
            </div>

            <h1 className="mt-5 text-3xl font-bold text-white">
              Inmobiliaria <span className="text-amber-400">Riri</span>
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Ingresá a tu cuenta para administrar las propiedades.
            </p>
          </div>

          {/* Usuario */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Usuario
            </label>

            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Ingresá tu usuario"
              {...register("username")}
              className={`w-full rounded-xl border bg-slate-800 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 ${
                errors.username
                  ? "border-red-500"
                  : "border-slate-700"
              }`}
            />

            {errors.username && (
              <p className="mt-2 text-sm text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Contraseña
            </label>

            <div className="relative">
              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Ingresá tu contraseña"
                {...register("password")}
                className={`w-full rounded-xl border bg-slate-800 px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 ${
                  errors.password
                    ? "border-red-500"
                    : "border-slate-700"
                }`}
              />

              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-amber-400 transition hover:text-amber-300"
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error de API */}
          {errorAPI && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {errorAPI}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 w-full rounded-xl bg-amber-400 px-4 py-3.5 font-bold text-slate-950 shadow-lg shadow-amber-400/10 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {/* Pie */}
          <div className="mt-8 border-t border-slate-700 pt-6 text-center">
            <p className="text-xs text-slate-500">
              Panel de administración · Inmobiliaria Riri
            </p>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Inmobiliaria Riri. Todos los derechos
          reservados.
        </p>
      </div>
    </main>
  );
}