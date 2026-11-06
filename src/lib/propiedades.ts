export type Barrio = {
  id: number;
  nombre: string;
  ciudad: string;
};

export type Propiedad = {
  id: number;
  titulo?: string;
  descripcion?: string;
  precio?: number | string;
  direccion?: string;
  barrio?: Barrio | string;
  superficie_m2?: number;
  estado?: string;
};

// Las vendidas y alquiladas solo las ve el admin
export function soloPublicas<T extends { estado?: string }>(propiedades: T[]) {
  return propiedades.filter(
    (propiedad) =>
      propiedad.estado !== "vendida" && propiedad.estado !== "alquilada"
  );
}

export function obtenerNombreBarrio(barrio?: Barrio | string) {
  if (!barrio) {
    return "";
  }

  if (typeof barrio === "string") {
    return barrio;
  }

  return barrio.nombre;
}

export function filtrarPropiedades(
  propiedades: Propiedad[],
  busqueda: string,
  barrioSeleccionado: string
) {
  return propiedades.filter((propiedad) => {
    const texto = busqueda.toLowerCase();

    const datosBusqueda = [
      propiedad.titulo,
      propiedad.descripcion,
      propiedad.direccion,
      obtenerNombreBarrio(propiedad.barrio),
    ];

    const coincideBusqueda = datosBusqueda.some((dato) =>
      dato?.toLowerCase().includes(texto)
    );

    const coincideBarrio =
      barrioSeleccionado === "Todos" ||
      obtenerNombreBarrio(propiedad.barrio) === barrioSeleccionado;

    return coincideBusqueda && coincideBarrio;
  });
}
