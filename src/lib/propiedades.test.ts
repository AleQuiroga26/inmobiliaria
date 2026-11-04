import { describe, expect, it } from "vitest";
import { filtrarPropiedades, type Propiedad } from "./propiedades";

const propiedades: Propiedad[] = [
  {
    id: 1,
    titulo: "Casa moderna",
    descripcion: "Casa con patio",
    direccion: "Constitución 346",
    precio: 52000,
    barrio: {
      id: 1,
      nombre: "Centro",
      ciudad: "Río Cuarto",
    },
  },
  {
    id: 2,
    titulo: "Departamento",
    descripcion: "Departamento luminoso",
    direccion: "San Martín 120",
    precio: 40000,
    barrio: {
      id: 2,
      nombre: "Banda Norte",
      ciudad: "Río Cuarto",
    },
  },
];

describe("Filtrado de propiedades", () => {
  it("busca propiedades por título", () => {
    const resultado = filtrarPropiedades(
      propiedades,
      "casa",
      "Todos"
    );

    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe("Casa moderna");
  });

  it("filtra propiedades por barrio", () => {
    const resultado = filtrarPropiedades(
      propiedades,
      "",
      "Centro"
    );

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(1);
  });
});
