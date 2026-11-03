
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().min(5, "Ingresá una descripción"),
  direccion: z.string().min(3, "Ingresá una dirección"),
  precio: z.coerce.number<number>().positive("El precio debe ser mayor a 0"),
});

type FormularioEdicion = z.infer<typeof schema>;

type Propiedad = {
  id: number;
  titulo: string;
  descripcion: string;
  direccion: string;
  precio: number | string;
};

function FormularioEditarPropiedad() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, isAuthenticated, isLoading } = useAuth();

  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormularioEdicion>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    async function cargarPropiedad() {
      try {
        const respuesta = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedades/${id}/`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo cargar la propiedad");
        }

        const datos: Propiedad = await respuesta.json();

        setPropiedad(datos);

        reset({
          titulo: datos.titulo,
          descripcion: datos.descripcion,
          direccion: datos.direccion,
          precio: Number(datos.precio),
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error desconocido"
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPropiedad();
  }, [id, token, isLoading, isAuthenticated, reset]);

  async function guardarCambios(datos: FormularioEdicion) {
    setError("");

    if (!token) {
      setError("Tu sesión no está disponible. Iniciá sesión nuevamente.");
      return;
    }

    try {
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/propiedades/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datos),
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(`No se pudieron guardar los cambios: ${detalle}`);
      }

      router.push("/admin/propiedades");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar los cambios"
      );
    }
  }

  if (isLoading || !isAuthenticated) {
    return <p className="p-8">Verificando sesión...</p>;
  }

  if (cargando) {
    return <p className="p-8">Cargando propiedad...</p>;
  }

  if (!propiedad) {
    return (
      <p className="p-8 text-red-500">
        {error || "No se encontró la propiedad."}
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <form
        onSubmit={handleSubmit(guardarCambios)}
        className="mx-auto max-w-xl space-y-5"
      >
        <h1 className="text-3xl font-bold">
          Editar propiedad #{id}
        </h1>

        <div>
          <label htmlFor="titulo" className="mb-2 block">
            Título
          </label>
          <input
            id="titulo"
            {...register("titulo")}
            className="w-full rounded bg-zinc-800 p-3"
          />
          {errors.titulo && (
            <p className="text-sm text-red-400">
              {errors.titulo.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className="mb-2 block">
            Descripción
          </label>
          <textarea
            id="descripcion"
            {...register("descripcion")}
            className="w-full rounded bg-zinc-800 p-3"
          />
          {errors.descripcion && (
            <p className="text-sm text-red-400">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="direccion" className="mb-2 block">
            Dirección
          </label>
          <input
            id="direccion"
            {...register("direccion")}
            className="w-full rounded bg-zinc-800 p-3"
          />
          {errors.direccion && (
            <p className="text-sm text-red-400">
              {errors.direccion.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="precio" className="mb-2 block">
            Precio
          </label>
          <input
            id="precio"
            type="number"
            min="1"
            step="1"
            {...register("precio")}
            className="w-full rounded bg-zinc-800 p-3"
          />
          {errors.precio && (
            <p className="text-sm text-red-400">
              {errors.precio.message}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 p-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}

export default function EditarPropiedadPage() {
  return (
    <Suspense fallback={<p className="p-8">Cargando editor...</p>}>
      <FormularioEditarPropiedad />
    </Suspense>
  );
}
