import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { colors, fonts, formatoPrecio } from "../theme";

// accion: "mas" (+ amarillo, creador) | "carro" (barra "Añadir al carro", tienda) | "ninguna"
export default function ProductCard({ producto, accion = "ninguna", onAdd, onPress, style }) {
  return (
    <View style={[styles.card, style]}>
      <Pressable onPress={onPress} disabled={!onPress}>
        <View style={styles.foto}>
          {producto.imagen ? (
            <Image source={{ uri: producto.imagen }} style={styles.img} contentFit="contain" />
          ) : null}
        </View>
        <View style={styles.info}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.nombre}>{producto.nombre || "Nombre de prenda"}</Text>
            <Text style={styles.dato}>Talla: {producto.talla ?? ""}</Text>
            <Text style={styles.dato}>Valor: {producto.precio ? formatoPrecio(producto.precio) : ""}</Text>
          </View>
          {accion === "mas" && (
            <Pressable style={styles.mas} onPress={onAdd} accessibilityLabel="Añadir al outfit">
              <Text style={styles.masTxt}>+</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
      {accion === "carro" && (
        <Pressable style={styles.carro} onPress={onAdd}>
          <Text style={styles.carroTxt}>Añadir al carro</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.rosa,
    borderWidth: 2,
    borderColor: colors.rosaOscuro,
    padding: 8,
  },
  foto: { width: "100%", aspectRatio: 1.15, backgroundColor: colors.gris, overflow: "hidden" },
  img: { width: "100%", height: "100%" },
  info: { flexDirection: "row", alignItems: "flex-end", marginTop: 6 },
  nombre: { fontFamily: fonts.textoBold, fontSize: 14, color: colors.negro },
  dato: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.negro, lineHeight: 15 },
  mas: {
    width: 30, height: 30, borderRadius: 6, backgroundColor: colors.amarillo,
    alignItems: "center", justifyContent: "center",
  },
  masTxt: { fontFamily: fonts.textoBold, fontSize: 20, lineHeight: 22, color: colors.negro },
  carro: {
    marginTop: 6, backgroundColor: colors.amarillo, borderWidth: 2, borderColor: colors.negro,
    paddingVertical: 3, alignItems: "center",
  },
  carroTxt: { fontFamily: fonts.textoBold, fontSize: 11, color: colors.negro },
});
