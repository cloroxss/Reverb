
export const CATEGORIAS = [

  { key: "cabeza", label: "Cabeza", titulo: "ACCESORIOS CABEZA", grupo: "accesorios",
    icon: require("./images/Rectangle 3-6.png"),
    palabras: ["cabeza", "gorr", "sombrero", "boina", "beanie", "casco", "audifono"] },
  { key: "bufanda", label: "Bufandas", titulo: "ACCESORIOS CUELLO", grupo: "accesorios",
    icon: require("./images/Rectangle 3-5.png"),
    palabras: ["bufanda", "panuelo", "cuello"] },
  { key: "guantes", label: "Guantes", titulo: "ACCESORIOS MANOS", grupo: "accesorios",
    icon: require("./images/Rectangle 3-3.png"),
    palabras: ["guante", "manopla", "mano"] },
  { key: "chaqueta", label: "Abrigos", titulo: "ABRIGOS", grupo: "prendas",
    icon: require("./images/Rectangle 3-4.png"),
    palabras: ["chaqueta", "abrigo", "chamarra", "jacket", "buzo", "saco"] },
  { key: "camiseta", label: "Camisetas", titulo: "CAMISETAS/CAMISAS", grupo: "prendas",
    icon: require("./images/Rectangle 3-2.png"),
    palabras: ["camiseta", "camisa", "playera", "polera", "remera"] },
  { key: "pantalon", label: "Pantalones", titulo: "PANTALONES", grupo: "prendas",
    icon: require("./images/Rectangle 3.png"),
    palabras: ["pantal", "jean", "falda", "short", "cargo"] },
  { key: "calzado", label: "Zapatos", titulo: "ZAPATOS", grupo: "prendas",
    icon: require("./images/Rectangle 3-1.png"),
    palabras: ["calzado", "zapato", "bota", "tenis", "zapatilla"] },
];

export function normalizarTexto(t) {
  return (t ?? "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function claveDeProducto(p) {
  const buscar = (t) => CATEGORIAS.find((c) => c.palabras.some((w) => t.includes(w)));

  const cat =
    buscar(normalizarTexto(p.categoria)) ||
    buscar(normalizarTexto(p.nombre).split(" ")[0]);
  return cat ? cat.key : "otro";
}

export function agruparPorCategoria(productos) {
  const secciones = CATEGORIAS.map((c) => ({
    key: c.key,
    label: c.label,
    items: productos.filter((p) => claveDeProducto(p) === c.key),
  }));
  secciones.push({ key: "otro", label: "Otros", items: productos.filter((p) => claveDeProducto(p) === "otro") });
  return secciones.filter((s) => s.items.length > 0);
}
