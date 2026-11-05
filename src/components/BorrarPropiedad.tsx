"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  id: number;
  titulo?: string;
  onBorrada: (id: number) => void;
};

export default function BorrarPropiedad({ id, titulo, onBorrada }: Props) {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [paso, setPaso] = useState<"inicio" | "confirmar" | "borrando">("inicio");
  const [error, setError] = useState("");

  async function borrar() {
    setPaso("borrando");
    setError("");

    try {
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/propiedades/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (respuesta.status === 401) {
        logout();
        router.replace("/login");
        return;
      }

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar la propiedad");
      }

      onBorrada(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
      setPaso("inicio");
    }
  }

  if (paso === "borrando") {
    return <span className="px-4 py-2 text-sm text-zinc-400">Eliminando...</span>;
  }

  if (paso === "confirmar") {
    return (
      <span className="inline-flex items-center gap-3">
        <button
          type="button"
          onClick={borrar}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
        >
          Sí, eliminar
        </button>
        <button
          type="button"
          onClick={() => setPaso("inicio")}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={() => setPaso("confirmar")}
        aria-label={`Eliminar ${titulo ?? "propiedad"}`}
        className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
      >
        Eliminar
      </button>
      {error && (
        <span role="alert" className="text-sm text-red-400">
          {error}
        </span>
      )}
    </span>
  );
}
