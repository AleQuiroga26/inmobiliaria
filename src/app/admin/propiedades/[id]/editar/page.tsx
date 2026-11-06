
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
  precio: z
    .string()
    .refine((valor) => valor === "" || Number(valor) > 0, "El precio debe ser mayor a 0"),
  operacion: z.enum(["venta", "alquiler"], { message: "Seleccioná la operación" }),
  moneda: z.enum(["ARS", "USD"], { message: "Seleccioná la moneda" }),
  estado: z.enum(["disponible", "reservada", "alquilada", "vendida"], {
    message: "Seleccioná el estado",
  }),
  superficie_m2: z.coerce.number<number>().positive("Ingresá la superficie"),
  ambientes: z.coerce.number<number>().int().min(0, "No puede ser negativo"),
  dormitorios: z.coerce.number<number>().int().min(0, "No puede ser negativo"),
  banios: z.coerce.number<number>().int().min(0, "No puede ser negativo"),
  cocheras: z.coerce.number<number>().int().min(0, "No puede ser negativo"),
  barrio: z.coerce.number<number>().int().positive("Seleccioná un barrio"),
  tipo: z.coerce.number<number>().int().positive("Seleccioná un tipo"),
  propietario: z.coerce.number<number>().int().positive("Seleccioná un propietario"),
  agente: z.coerce.number<number>().int().positive("Seleccioná un agente"),
  caracteristicas: z.union([z.array(z.string()), z.string(), z.boolean()]).optional(),
});

type FormularioEdicion = z.infer<typeof schema>;

type Propiedad = {
  id: number;
  titulo: string;
  descripcion: string;
  direccion: string;
  precio: number | string | null;
  operacion: FormularioEdicion["operacion"];
  moneda: FormularioEdicion["moneda"];
  estado: FormularioEdicion["estado"];
  superficie_m2: number;
  ambientes: number;
  dormitorios: number;
  banios: number;
  cocheras: number;
  barrio: number;
  tipo: number;
  propietario: number;
  agente: number | null;
  caracteristicas: number[];
};

type Opcion = {
  id: number;
  nombre?: string;
  apellido?: string;
};

const cantidades = [
  { nombre: "superficie_m2", etiqueta: "Superficie (m²)" },
  { nombre: "ambientes", etiqueta: "Ambientes" },
  { nombre: "dormitorios", etiqueta: "Dormitorios" },
  { nombre: "banios", etiqueta: "Baños" },
  { nombre: "cocheras", etiqueta: "Cocheras" },
] as const;

const fijos = [
  {
    nombre: "operacion",
    etiqueta: "Operación",
    opciones: [["venta", "Venta"], ["alquiler", "Alquiler"]],
  },
  {
    nombre: "moneda",
    etiqueta: "Moneda",
    opciones: [["USD", "Dólares (USD)"], ["ARS", "Pesos (ARS)"]],
  },
  {
    nombre: "estado",
    etiqueta: "Estado",
    opciones: [
      ["disponible", "Disponible"],
      ["reservada", "Reservada"],
      ["alquilada", "Alquilada"],
      ["vendida", "Vendida"],
    ],
  },
] as const;

function FormularioEditarPropiedad() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, isAuthenticated, isLoading } = useAuth();

  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [barrios, setBarrios] = useState<Opcion[]>([]);
  const [tipos, setTipos] = useState<Opcion[]>([]);
  const [propietarios, setPropietarios] = useState<Opcion[]>([]);
  const [agentes, setAgentes] = useState<Opcion[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<Opcion[]>([]);
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
        const api = process.env.NEXT_PUBLIC_API_URL;
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        async function obtener(ruta: string) {
          const respuesta = await fetch(`${api}/${ruta}/`, { headers });

          if (!respuesta.ok) {
            throw new Error(`Error al cargar ${ruta}`);
          }

          const datos = await respuesta.json();
          return datos.results ?? datos;
        }

        const respuesta = await fetch(`${api}/propiedades/${id}/`, { headers });

        if (!respuesta.ok) {
          throw new Error("No se pudo cargar la propiedad");
        }

        const datos: Propiedad = await respuesta.json();

        const [b, t, p, a, c] = await Promise.all([
          obtener("barrios"),
          obtener("tipos-propiedad"),
          obtener("propietarios"),
          obtener("agentes"),
          obtener("caracteristicas"),
        ]);

        setBarrios(b);
        setTipos(t);
        setPropietarios(p);
        setAgentes(a);
        setCaracteristicas(c);
        setPropiedad(datos);

        reset({
          titulo: datos.titulo,
          descripcion: datos.descripcion,
          direccion: datos.direccion,
          precio: datos.precio === null ? "" : String(Number(datos.precio)),
          operacion: datos.operacion,
          moneda: datos.moneda,
          estado: datos.estado,
          superficie_m2: datos.superficie_m2,
          ambientes: datos.ambientes,
          dormitorios: datos.dormitorios,
          banios: datos.banios,
          cocheras: datos.cocheras,
          barrio: datos.barrio,
          tipo: datos.tipo,
          propietario: datos.propietario,
          agente: datos.agente ?? undefined,
          caracteristicas: datos.caracteristicas.map(String),
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

    const elegidas = Array.isArray(datos.caracteristicas)
      ? datos.caracteristicas
      : typeof datos.caracteristicas === "string"
        ? [datos.caracteristicas]
        : [];

    try {
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/propiedades/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...datos,
            precio: datos.precio === "" ? null : Number(datos.precio),
            caracteristicas: elegidas.map(Number),
          }),
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
            Precio (vacío = Consultar precio)
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

        {fijos.map((campo) => (
          <div key={campo.nombre}>
            <label htmlFor={campo.nombre} className="mb-2 block">
              {campo.etiqueta}
            </label>
            <select
              id={campo.nombre}
              {...register(campo.nombre)}
              className="w-full rounded bg-zinc-800 p-3"
            >
              {campo.opciones.map(([valor, texto]) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
            {errors[campo.nombre] && (
              <p className="text-sm text-red-400">
                {errors[campo.nombre]?.message}
              </p>
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {cantidades.map((campo) => (
            <div key={campo.nombre}>
              <label htmlFor={campo.nombre} className="mb-2 block">
                {campo.etiqueta}
              </label>
              <input
                id={campo.nombre}
                type="number"
                min="0"
                step="1"
                {...register(campo.nombre)}
                className="w-full rounded bg-zinc-800 p-3"
              />
              {errors[campo.nombre] && (
                <p className="text-sm text-red-400">
                  {errors[campo.nombre]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        {[
          { nombre: "barrio" as const, etiqueta: "Barrio", opciones: barrios },
          { nombre: "tipo" as const, etiqueta: "Tipo de propiedad", opciones: tipos },
          { nombre: "propietario" as const, etiqueta: "Propietario", opciones: propietarios },
          { nombre: "agente" as const, etiqueta: "Agente", opciones: agentes },
        ].map((campo) => (
          <div key={campo.nombre}>
            <label htmlFor={campo.nombre} className="mb-2 block">
              {campo.etiqueta}
            </label>
            <select
              id={campo.nombre}
              {...register(campo.nombre)}
              className="w-full rounded bg-zinc-800 p-3"
            >
              <option value="">Seleccionar...</option>
              {campo.opciones.map((opcion) => (
                <option key={opcion.id} value={opcion.id}>
                  {[opcion.nombre, opcion.apellido]
                    .filter(Boolean)
                    .join(" ") || `Registro #${opcion.id}`}
                </option>
              ))}
            </select>
            {errors[campo.nombre] && (
              <p className="text-sm text-red-400">
                {errors[campo.nombre]?.message}
              </p>
            )}
          </div>
        ))}

        {caracteristicas.length > 0 && (
          <fieldset>
            <legend className="mb-2">Características</legend>
            <div className="flex flex-wrap gap-4">
              {caracteristicas.map((caracteristica) => (
                <label
                  key={caracteristica.id}
                  className="flex items-center gap-2 rounded bg-zinc-800 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    value={caracteristica.id}
                    {...register("caracteristicas")}
                  />
                  {caracteristica.nombre}
                </label>
              ))}
            </div>
          </fieldset>
        )}

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
