import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useStore } from "../context/StoreContext";
import StarButton from "./StarButton";
import { colors, fonts, formatoPrecio } from "../theme";

// Barra rosa de la izquierda en el Creador de outfits y el detalle de prenda.
export default function ResumenCompra({ style }) {
  const router = useRouter();
  const { outfit, outfitSubtotal, removeFromOutfit, outfitToCart } = useStore();

  const comprar = () => {
    outfitToCart();
    router.push("/carrito");
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.titulo}>Resumen de compra</Text>

      <View style={styles.lista}>
        {outfit.length === 0 && <Text style={styles.vacio}>Aún no has añadido prendas a tu outfit.</Text>}
        {outfit.map((p) => (
          <View key={p.id} style={styles.fila}>
            <Text numberOfLines={1} style={[styles.texto, { flex: 1 }]}>{p.nombre}</Text>
            <Text style={styles.precio}>{formatoPrecio(p.precio)}</Text>
            <Pressable onPress={() => removeFromOutfit(p.id)} accessibilityLabel={`Quitar ${p.nombre}`}>
              <Text style={styles.quitar}>−</Text>
            </Pressable>
          </View>
        ))}
        <View style={[styles.fila, { borderBottomWidth: 0 }]}>
          <Text style={[styles.texto, { flex: 1 }]}>Subtotal</Text>
          <Text style={styles.precio}>{formatoPrecio(outfitSubtotal)}</Text>
        </View>
      </View>

      <StarButton title="Comprar" variant="negro" small onPress={comprar} disabled={outfit.length === 0} style={{ alignSelf: "center", marginTop: 14 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.rosa, padding: 10 },
  titulo: { fontFamily: fonts.textoBold, fontSize: 16, color: colors.negro, textAlign: "center", marginVertical: 12 },
  lista: { borderTopWidth: 1, borderColor: colors.negro },
  fila: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 9, borderBottomWidth: 1, borderColor: colors.negro },
  texto: { fontFamily: fonts.textoBold, fontSize: 12, color: colors.negro },
  precio: { fontFamily: fonts.textoBold, fontSize: 16, color: colors.negro },
  quitar: { fontFamily: fonts.textoBold, fontSize: 16, color: colors.negro, paddingHorizontal: 2 },
  vacio: { fontFamily: fonts.texto, fontSize: 12, color: colors.negro, paddingVertical: 10 },
});
