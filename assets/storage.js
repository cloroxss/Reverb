
const memoria = {};

export function leer(clave) {
  try {
    if (typeof localStorage !== "undefined") {
      const v = localStorage.getItem(clave);
      return v ? JSON.parse(v) : null;
    }
  } catch {}
  return memoria[clave] ?? null;
}

export function guardar(clave, valor) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(clave, JSON.stringify(valor));
      return;
    }
  } catch {}
  memoria[clave] = valor;
}
