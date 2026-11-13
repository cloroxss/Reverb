import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Screen from "../../assets/Component/Screen";
import ResumenPedido from "../../assets/Component/ResumenPedido";
import StarButton from "../../assets/Component/StarButton";
import { useStore } from "../../assets/context/StoreContext";
import { colors, fonts, formatoPrecio, useLayout } from "../../assets/theme";

export default function Carrito() {
  const router = useRouter();
  const { isNarrow, width } = useLayout();
  const { cart, changeQty, cartCount } = useStore();

  return (
    <Screen contentStyle={{ alignItems: "center", paddingVertical: 24, paddingHorizontal: 16, gap: 28 }}>
      <Text style={[styles.titulo, { fontSize: Math.min(64, width * 0.14) }]}>TU CARRITO</Text>

      <View style={{ flexDirection: isNarrow ? "column" : "row", gap: 24, width: "100%", maxWidth: 1000, alignItems: "flex-start" }}>
        <View style={[styles.lista, { width: isNarrow ? "100%" : undefined, flex: isNarrow ? undefined : 1 }]}>
          {cart.length === 0 && (
            <View style={{ padding: 24, alignItems: "center", gap: 16 }}>
              <Text style={styles.nombre}>Tu carrito está vacío.</Text>
              <StarButton title="Ir a la tienda" small onPress={() => router.push("/tienda")} />
            </View>
          )}
          {cart.map(({ producto: p, cantidad }, i) => (
            <View key={p.id} style={[styles.fila, i > 0 && { borderTopWidth: 1, borderColor: colors.rosaOscuro }]}>
              <View style={styles.thumb}>
                {p.imagen ? <Image source={{ uri: p.imagen }} style={{ width: "100%", height: "100%" }} contentFit="cover" /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={styles.nombre}>{p.nombre || "Nombre de prenda"}</Text>
                <Text style={styles.dato}>Talla: {p.talla ?? ""}</Text>
                <Text style={styles.dato}>Valor: {formatoPrecio(p.precio)}</Text>
              </View>
              <Text style={styles.precio}>{formatoPrecio(p.precio * cantidad)}</Text>
              <View style={styles.stepper}>
                <Pressable style={styles.stepBtn} onPress={() => changeQty(p.id, -1)} accessibilityLabel="Quitar una unidad">
                  <Text style={styles.stepTxt}>-</Text>
                </Pressable>
                <Text style={[styles.stepTxt, styles.stepNum]}>{cantidad}</Text>
                <Pressable style={styles.stepBtn} onPress={() => changeQty(p.id, 1)} accessibilityLabel="Agregar una unidad">
                  <Text style={styles.stepTxt}>+</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <ResumenPedido
          style={{ width: isNarrow ? "100%" : 270 }}
          botonTitulo="Proceder al pago"
          botonDeshabilitado={cartCount === 0}
          onBoton={() => router.push("/pago")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titulo: { fontFamily: fonts.titulo, color: colors.amarillo },
  lista: { backgroundColor: colors.rosa },
  fila: { flexDirection: "row", alignItems: "center", gap: 14, padding: 8 },
  thumb: { width: 66, height: 66, backgroundColor: colors.gris, borderWidth: 2, borderColor: colors.blanco, overflow: "hidden" },
  nombre: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.negro },
  dato: { fontFamily: fonts.textoBold, fontSize: 12, color: colors.negro, lineHeight: 14 },
  precio: { fontFamily: fonts.textoBold, fontSize: 14, color: colors.negro, marginHorizontal: 8 },
  stepper: { flexDirection: "row", borderWidth: 1, borderColor: colors.negro, backgroundColor: colors.blanco },
  stepBtn: { width: 26, height: 24, alignItems: "center", justifyContent: "center" },
  stepTxt: { fontFamily: fonts.texto, fontSize: 14, color: colors.negro },
  stepNum: { width: 26, textAlign: "center", lineHeight: 24, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.negro },
});
