
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const schema = z.object({
  titulo: z.string().min(3, "Ingresá un título"),
  descripcion: z.string().min(5, "Ingresá una descripción"),
  direccion: z.string().min(3, "Ingresá una dirección"),
  precio: z.coerce.number<number>().positive("El precio debe ser mayor a 0"),
  superficie_m2: z.coerce.number<number>().positive("Ingresá la superficie"),
  barrio: z.coerce.number<number>().int().positive("Seleccioná un barrio"),
  tipo: z.coerce.number<number>().int().positive("Seleccioná un tipo"),
  propietario: z.coerce.number<number>().int().positive("Seleccioná un propietario"),
  agente: z.coerce.number<number>().int().positive("Seleccioná un agente"),
});

type Formulario = z.infer<typeof schema>;

type Opcion = {
  id: number;
  nombre?: string;
  apellido?: string;
};

export default function NuevaPropiedadPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading } = useAuth();

  const [barrios, setBarrios] = useState<Opcion[]>([]);
  const [tipos, setTipos] = useState<Opcion[]>([]);
  const [propietarios, setPropietarios] = useState<Opcion[]>([]);
  const [agentes, setAgentes] = useState<Opcion[]>([]);
  const [errorAPI, setErrorAPI] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;

    async function cargarOpciones() {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL;

        async function obtener(ruta: string) {
          const respuesta = await fetch(`${api}/${ruta}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!respuesta.ok) {
            throw new Error(`Error al cargar ${ruta}`);
          }

          const datos = await respuesta.json();
          return datos.results ?? datos;
        }

        const [b, t, p, a] = await Promise.all([
          obtener("barrios"),
          obtener("tipos-propiedad"),
          obtener("propietarios"),
          obtener("agentes"),
        ]);

        setBarrios(b);
        setTipos(t);
        setPropietarios(p);
        setAgentes(a);
      } catch (error) {
        setErrorAPI(
          error instanceof Error ? error.message : "Error al cargar opciones"
        );
      }
    }

    cargarOpciones();
  }, [token]);

  async function guardar(datos: Formulario) {
    setErrorAPI("");

    try {
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/propiedades/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...datos,
            operacion: "venta",
            moneda: "ARS",
            ambientes: 3,
            dormitorios: 2,
            banios: 1,
            cocheras: 0,
            estado: "disponible",
            caracteristicas: [],
          }),
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(`No se pudo guardar: ${detalle}`);
      }

      router.push("/admin/propiedades");
    } catch (error) {
      setErrorAPI(
        error instanceof Error ? error.message : "Error al guardar"
      );
    }
  }

  if (isLoading || !isAuthenticated) {
    return <p className="p-8">Verificando sesión...</p>;
  }

  const campos = [
    { nombre: "titulo", etiqueta: "Título" },
    { nombre: "descripcion", etiqueta: "Descripción" },
    { nombre: "direccion", etiqueta: "Dirección" },
    { nombre: "precio", etiqueta: "Precio" },
    { nombre: "superficie_m2", etiqueta: "Superficie (m²)" },
  ] as const;

  const selecciones = [
    { nombre: "barrio", etiqueta: "Barrio", opciones: barrios },
    { nombre: "tipo", etiqueta: "Tipo de propiedad", opciones: tipos },
    { nombre: "propietario", etiqueta: "Propietario", opciones: propietarios },
    { nombre: "agente", etiqueta: "Agente", opciones: agentes },
  ] as const;

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <form
        onSubmit={handleSubmit(guardar)}
        className="mx-auto max-w-xl space-y-5"
      >
        <h1 className="text-3xl font-bold">Nueva propiedad</h1>

        {campos.map((campo) => (
          <div key={campo.nombre}>
            <label className="mb-1 block">{campo.etiqueta}</label>
            <input
              {...register(campo.nombre)}
              type={
                campo.nombre === "precio" ||
                campo.nombre === "superficie_m2"
                  ? "number"
                  : "text"
              }
              className="w-full rounded bg-zinc-800 p-3"
            />
            {errors[campo.nombre] && (
              <p className="text-sm text-red-400">
                {errors[campo.nombre]?.message}
              </p>
            )}
          </div>
        ))}

        {selecciones.map((campo) => (
          <div key={campo.nombre}>
            <label className="mb-1 block">{campo.etiqueta}</label>
            <select
              {...register(campo.nombre)}
              className="w-full rounded bg-zinc-800 p-3"
              defaultValue=""
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

        {errorAPI && (
          <p className="text-sm text-red-400">{errorAPI}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 p-3 font-semibold disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar propiedad"}
        </button>
      </form>
    </main>
  );
}
