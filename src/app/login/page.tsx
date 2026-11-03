
"use client";

import { useState } from "react";
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
  const { login } = useAuth();

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
        alert("¡Inicio de sesión exitoso!");
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="text-2xl font-bold">Inmobiliaria Riri</h1>
        <p className="text-zinc-400">Iniciar sesión</p>

        <div>
          <label htmlFor="username" className="mb-2 block">
            Usuario
          </label>
          <input
            id="username"
            {...register("username")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-400">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {errorAPI && (
          <p role="alert" className="text-sm text-red-400">
            {errorAPI}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
