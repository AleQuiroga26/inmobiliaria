import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PrecioPropiedad from "./PrecioPropiedad";

describe("PrecioPropiedad", () => {
  it("muestra Consultar precio si no hay precio", () => {
    render(<PrecioPropiedad precio={null} />);
    expect(screen.getByText("Consultar precio")).toBeInTheDocument();
  });

  it("formatea el precio en dolares", () => {
    const { container } = render(<PrecioPropiedad precio={185000} moneda="USD" />);
    expect(container).toHaveTextContent("US$ 185.000");
  });
});
