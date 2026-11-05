type Props = {
  precio?: number | string | null;
  moneda?: string;
};

export default function PrecioPropiedad({ precio, moneda = "ARS" }: Props) {
  const valor = Number(precio);

  if (precio === null || precio === undefined || precio === "" || valor <= 0) {
    return <span>Consultar precio</span>;
  }

  const texto = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

  return <span>{texto}</span>;
}
