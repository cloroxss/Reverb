import { createContext, useContext, useEffect, useState } from "react";
import { guardar, leer } from "../storage";
import { claveDeProducto } from "../categorias";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);       // [{ producto, cantidad }]
  const [outfit, setOutfit] = useState([]);   // [producto]
  const [savedOutfit, setSavedOutfit] = useState(null);

  // Recupera el estilo guardado (web)
  useEffect(() => {
    const g = leer("outfit_guardado");
    if (g) setSavedOutfit(g);
  }, []);

  // ---- Carrito ----
  const addToCart = (producto) =>
    setCart((prev) => {
      const i = prev.findIndex((x) => x.producto.id === producto.id);
      if (i === -1) return [...prev, { producto, cantidad: 1 }];
      return prev.map((x, j) => (j === i ? { ...x, cantidad: x.cantidad + 1 } : x));
    });

  const changeQty = (id, delta) =>
    setCart((prev) =>
      prev
        .map((x) => (x.producto.id === id ? { ...x, cantidad: x.cantidad + delta } : x))
        .filter((x) => x.cantidad > 0)
    );

  const clearCart = () => setCart([]);

  // ---- Outfit (una prenda por categoría) ----
  const addToOutfit = (producto) =>
    setOutfit((prev) => {
      const clave = claveDeProducto(producto);
      const resto = prev.filter(
        (p) => p.id !== producto.id && (clave === "otro" || claveDeProducto(p) !== clave)
      );
      return [...resto, producto];
    });

  const removeFromOutfit = (id) => setOutfit((prev) => prev.filter((p) => p.id !== id));

  // Pasa el outfit al carrito y lo vacía (así no se duplica si vuelves al creador)
  const outfitToCart = () => {
    outfit.forEach(addToCart);
    setOutfit([]);
  };

  const saveOutfit = () => {
    setSavedOutfit(outfit);
    guardar("outfit_guardado", outfit);
  };
  const loadOutfit = () => {
    if (!savedOutfit) return false;
    setOutfit(savedOutfit);
    return true;
  };

  const cartCount = cart.reduce((s, x) => s + x.cantidad, 0);
  const cartSubtotal = cart.reduce((s, x) => s + x.producto.precio * x.cantidad, 0);
  const outfitSubtotal = outfit.reduce((s, p) => s + p.precio, 0);
  const envio = 0;

  return (
    <StoreContext.Provider
      value={{
        cart, outfit, savedOutfit,
        addToCart, changeQty, clearCart,
        addToOutfit, removeFromOutfit, outfitToCart, saveOutfit, loadOutfit,
        cartCount, cartSubtotal, outfitSubtotal, envio,
        cartTotal: cartSubtotal + envio,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
