import { normalizarTexto } from "./categorias";

export const ARTISTAS = [
  { id: "the-vamp", nombre: "THE VAMP", url: null, productos: [],
    imagen: require("./images/artista-the-vamp.png"),
    descripcion: "Banda de horror punk bogotana, creada por un grupo de amigas amantes del cine y la literatura clásica de ciencia ficción y terror." },
  { id: "perro-muerto", nombre: "Perro Muerto", url: null, productos: [],
    imagen: require("./images/Rectangle 9 (1).png"),
    descripcion: "Banda activa entre 1997 y 2003, muy recordada en la escena del rock capitalino y en festivales como Rock al Parque y La Media Torta." },
  { id: "narcocracia", nombre: "Narcocracia", url: null, productos: [],
    imagen: require("./images/artista-narcocracia.png"),
    descripcion: "Narcocracia es una banda de Groove Metal colombiana creada en 2020, la cual hace uso del humor negro y la sátira para hacer una crítica social por medio de su música." },
  { id: "solegnium", nombre: "Solegnium", url: null, productos: [],
    imagen: require("./images/artista-solegnium.png"),
    descripcion: "Solegnium es una banda de brutal death metal originaria de Soacha y creada en 2006 por el guitarrista Edward Parra." },
  { id: "casi", nombre: "CASI", url: null, productos: [],
    imagen: require("./images/artista-casi.png"),
    descripcion: "Casi es una banda de Rock Latinoamericano fundada en Bogotá, Colombia, en 2022 por Juan Antonio Carulla, músico y compositor. Su propuesta es una exploración de los ritmos colombianos desde el lenguaje rockero." },
  { id: "asma", nombre: "A.S.M.A", url: null, productos: [],
    imagen: require("./images/artista-asma.png"),
    descripcion: "A.S.M.A (Arrojando Siempre Música Agresiva) es una banda de punk rock y groove proveniente de Bosa y fundada en 2010 con el objetivo de narrar la realidad social, la cotidianidad y la desigualdad del país a través de su música." },
];

export function productosDeArtista(productos, artista) {
  if (artista.productos?.length) {
    const nombres = artista.productos.map(normalizarTexto);
    const elegidos = productos.filter((p) => nombres.includes(normalizarTexto(p.nombre)));
    if (elegidos.length) return elegidos;
  }
  const conArtista = productos.filter((p) => p.artista != null);
  const propios = conArtista.filter((p) =>
    [artista.id, artista.nombre].some((v) => normalizarTexto(v) === normalizarTexto(p.artista))
  );
  if (propios.length > 0) return propios;

  const n = productos.length;
  if (n <= 4) return productos;
  const inicio = (ARTISTAS.indexOf(artista) * 4) % n;
  return Array.from({ length: 4 }, (_, k) => productos[(inicio + k) % n]);
}
