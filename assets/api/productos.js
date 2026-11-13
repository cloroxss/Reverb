import { useEffect, useState } from "react";
import api, { SUPABASE_URL } from "./axios";

// ⚙️ Si en la tabla Producto la foto está guardada solo como ruta de Supabase Storage
// (ej. "chaqueta1.png"), pon aquí el nombre de tu bucket público.
export const STORAGE_BUCKET = "productos";

const EXT = /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i;
const CLAVES_IMAGEN = [
  "imagen", "imagen_url", "url_imagen", "foto", "foto_url", "img",
  "image", "image_url", "ruta_imagen", "url", "imagenes", "fotos",
];

// Convierte un texto en una URL de imagen utilizable (o null).
// estricto = true -> solo acepta cosas que parezcan una imagen (para escanear columnas desconocidas).
function aUrl(valor, estricto) {
  if (typeof valor !== "string") return null;
  const v = valor.trim();
  if (!v) return null;
  if (v.startsWith("data:image")) return v;
  if (/^https?:\/\//i.test(v)) return !estricto || EXT.test(v) || v.includes("/storage/v1/") ? v : null;
  if (!EXT.test(v)) return null;

  // Ruta relativa de Supabase Storage
  let ruta = v.replace(/^\/+/, "");
  if (ruta.startsWith("storage/v1/")) return `${SUPABASE_URL}/${ruta}`;
  if (ruta.startsWith("object/public/")) return `${SUPABASE_URL}/storage/v1/${ruta}`;
  if (!ruta.startsWith(STORAGE_BUCKET + "/")) ruta = `${STORAGE_BUCKET}/${ruta}`;
  return `${SUPABASE_URL}/storage/v1/object/public/${ruta}`;
}

// Soporta texto, arreglos, objetos { url } y JSON guardado como texto.
function extraer(valor, estricto) {
  if (Array.isArray(valor)) {
    for (const x of valor) { const u = extraer(x, estricto); if (u) return u; }
    return null;
  }
  if (valor && typeof valor === "object") {
    return extraer(valor.url ?? valor.publicUrl ?? valor.path ?? null, estricto);
  }
  if (typeof valor === "string") {
    const t = valor.trim();
    if (t.startsWith("[") || t.startsWith("{")) {
      try { return extraer(JSON.parse(t), estricto); } catch {}
    }
    return aUrl(t, estricto);
  }
  return null;
}

// Busca la foto en las columnas habituales y, si no, en cualquier columna que parezca una imagen.
export function imagenDeFila(r) {
  for (const k of CLAVES_IMAGEN) {
    const u = extraer(r[k], false);
    if (u) return u;
  }
  for (const k of Object.keys(r)) {
    const u = extraer(r[k], true);
    if (u) return u;
  }
  return null;
}

// En tu bucket los archivos se llaman igual que el producto: "<nombre>.png".
export const EXTENSION_FOTO = ".png";
export function imagenPorNombre(nombre) {
  if (!nombre) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodeURIComponent(nombre.trim() + EXTENSION_FOTO)}`;
}

const porId = (filas) => new Map((filas || []).map((f) => [String(f.id), f]));

// Convierte una fila de Supabase al formato que usa la app.
// `ref` trae las tablas de apoyo (Talla, Categoria, Estado) para traducir los números a texto.
export function normalizar(r, ref = {}) {
  const talla = ref.tallas?.get(String(r.talla));
  const categoria = ref.categorias?.get(String(r.categoria));
  const estado = ref.estados?.get(String(r.estado));
  return {
    // La tabla Producto no tiene `id`: se usa el nombre como identificador.
    id: r.id ?? r.nombre,
    nombre: r.nombre,
    precio: Number(r.precio) || 0,
    talla: talla ? (talla.talla ?? talla.nombre) : r.talla,
    categoria: categoria ? categoria.nombre : r.categoria,
    estado: estado ? estado.nombre : r.estado,
    // Si algún día agregas una columna de imagen se usa; si no, el archivo del bucket con el mismo nombre.
    imagen: imagenDeFila(r) || imagenPorNombre(r.nombre),
    artista: r.artista_id ?? r.artista ?? null,
  };
}

const pedir = (tabla) =>
  api.get(`/${tabla}`, { params: { select: "*" } }).then((x) => x.data).catch((e) => {
    console.warn(`[Reverb] No se pudo leer la tabla ${tabla}:`, e?.message);
    return [];
  });

export async function getProductos() {
  const [prods, tallas, categorias, estados] = await Promise.all([
    api.get("/Producto", { params: { select: "*", order: "nombre.asc" } }).then((x) => x.data),
    pedir("Talla"), pedir("Categoria"), pedir("Estado"),
  ]);
  const ref = { tallas: porId(tallas), categorias: porId(categorias), estados: porId(estados) };
  const lista = (Array.isArray(prods) ? prods : []).map((r) => normalizar(r, ref));

  // Diagnóstico (solo en desarrollo): mira la consola de Metro / del navegador.
  if (__DEV__) {
    console.log(`[Reverb] ${lista.length} productos. Ejemplo:`, lista[0]);
    const otros = lista.filter((p) => typeof p.categoria !== "string" || !p.categoria.trim());
    if (otros.length) console.warn(`[Reverb] ${otros.length} productos sin nombre de categoría (revisa la tabla Categoria o sus permisos).`);
  }
  return lista;
}

let cache = null;

export function useProductos() {
  const [productos, setProductos] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return;
    let vivo = true;
    getProductos()
      .then((d) => { cache = d; if (vivo) { setProductos(d); setLoading(false); } })
      .catch((e) => { console.error("Error al obtener productos:", e); if (vivo) { setError(e); setLoading(false); } });
    return () => { vivo = false; };
  }, []);

  return { productos, loading, error };
}
