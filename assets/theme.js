import { useWindowDimensions } from "react-native";

export const colors = {
  negro: "#000000",
  rosa: "#FF89FD",
  rosaClaro: "#F4A8F2",
  rosaOscuro: "#B84FB5",
  amarillo: "#F5F544",
  gris: "#D9D9D9",
  blanco: "#FFFFFF",
  estrella: "#FF6FB5",
};

export const fonts = {
  titulo: "RoadRage",
  texto: "Oswald_500Medium",
  textoBold: "Oswald_700Bold",
};

export const formatoPrecio = (n) =>
  "$" + String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export function useLayout() {
  const { width, height } = useWindowDimensions();
  return { width, height, isNarrow: width < 900, isPhone: width < 600 };
}
