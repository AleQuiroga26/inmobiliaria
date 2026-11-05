
const imagenesPropiedades = [
  // Casa moderna
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900",

  // Departamento moderno
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900",

  // Casa con pileta y jardín
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900",

  // Casa de dos plantas
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900",

  // Casa con fachada moderna
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900",

  // Interior de vivienda
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900",

  // Living moderno
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900",

  // Casa contemporánea
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900",
];

export function obtenerImagenPropiedad(id: number) {
  return imagenesPropiedades[(id - 1) % imagenesPropiedades.length];
}
