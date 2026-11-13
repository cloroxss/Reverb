import { StyleSheet, Text, View } from "react-native";
import { useStore } from "../context/StoreContext";
import StarButton from "./StarButton";
import { colors, fonts, formatoPrecio } from "../theme";

// Tarjeta "RESUMEN DE COMPRA" del carrito y del pago.
export default function ResumenPedido({ botonTitulo, onBoton, botonDeshabilitado, style }) {
  const { cartCount, cartSubtotal, envio, cartTotal } = useStore();
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.titulo}>RESUMEN DE COMPRA</Text>
      <Fila label="CANTIDAD" valor={`${cartCount} unidades`} />
      <Fila label="SUBTOTAL" valor={formatoPrecio(cartSubtotal)} />
      <Fila label="ENVIO" valor={formatoPrecio(envio)} />
      <View style={styles.linea} />
      <View style={styles.fila}>
        <Text style={styles.total}>TOTAL</Text>
        <Text style={styles.total}>{formatoPrecio(cartTotal)}</Text>
      </View>
      {botonTitulo ? (
        <StarButton title={botonTitulo} variant="negro" small onPress={onBoton} disabled={botonDeshabilitado} style={{ alignSelf: "center", marginTop: 18 }} />
      ) : null}
    </View>
  );
}

function Fila({ label, valor }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.label}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.rosa, padding: 14 },
  titulo: { fontFamily: fonts.textoBold, fontSize: 20, color: colors.negro, marginBottom: 12 },
  fila: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
  label: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.negro },
  linea: { height: 1, backgroundColor: colors.rosaOscuro, marginVertical: 12 },
  total: { fontFamily: fonts.textoBold, fontSize: 22, color: colors.negro },
});
