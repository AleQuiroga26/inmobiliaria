import PropiedadCard from "@/components/PropiedadCard";

export default async function PropiedadesDisponibles() {
  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/propiedades/disponibles/`,
    { cache: "no-store" }
  );

  if (!respuesta.ok) {
    return (
      <p role="alert" className="text-red-600 dark:text-red-400">
        No pudimos cargar las propiedades disponibles.
      </p>
    );
  }

  const datos = await respuesta.json();
  const propiedades = datos.results ?? datos;

  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {propiedades.map((propiedad: { id: number }) => (
        <PropiedadCard key={propiedad.id} propiedad={propiedad} />
      ))}
    </div>
  );
}
