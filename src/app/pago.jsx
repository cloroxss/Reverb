import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../../assets/Component/Screen";
import ResumenPedido from "../../assets/Component/ResumenPedido";
import StarButton from "../../assets/Component/StarButton";
import { useStore } from "../../assets/context/StoreContext";
import { colors, fonts, useLayout } from "../../assets/theme";

// Cambia estos métodos por los que realmente ofrezca la tienda.
const METODOS = ["Visa", "Mastercard", "PSE", "Nequi", "Daviplata", "Efectivo"];

export default function Pago() {
  const router = useRouter();
  const { isNarrow } = useLayout();
  const { cartCount } = useStore();
  const [metodo, setMetodo] = useState(null);
  const [error, setError] = useState("");

  // OJO: estos datos de tarjeta no se guardan. Para cobrar de verdad usa una
  // pasarela de pagos (Wompi, PayU, Mercado Pago, Stripe...) y no tu propia base de datos.
  const continuar = () => {
    if (!metodo) return setError("Elige un método de pago.");
    router.push("/envio");
  };

  return (
    <Screen contentStyle={{ alignItems: "center", justifyContent: "center", padding: 24 }}>
      <View style={{ flexDirection: isNarrow ? "column" : "row", gap: 32, width: "100%", maxWidth: 820, alignItems: "flex-start" }}>
        <ResumenPedido style={{ width: isNarrow ? "100%" : 270 }} />

        <View style={[styles.card, { flex: isNarrow ? undefined : 1, width: isNarrow ? "100%" : undefined }]}>
          <View style={styles.metodos}>
            <Text style={styles.subtitulo}>Elige metodo de pago</Text>
            <View style={styles.grid}>
              {METODOS.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => { setMetodo(m); setError(""); }}
                  style={[styles.metodo, metodo === m && { backgroundColor: colors.amarillo }]}
                >
                  <Text style={styles.metodoTxt}>{m}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <TextInput style={styles.input} placeholder="Tarjeta **** 2134" placeholderTextColor="rgba(0,0,0,0.5)" keyboardType="number-pad" maxLength={19} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TextInput style={[styles.input, { width: 90 }]} placeholder="ccv" placeholderTextColor="rgba(0,0,0,0.5)" keyboardType="number-pad" maxLength={4} secureTextEntry />
            <TextInput style={[styles.input, { width: 90 }]} placeholder="mm/aa" placeholderTextColor="rgba(0,0,0,0.5)" maxLength={5} />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <StarButton title="Realizar compra" variant="negro" small onPress={continuar} disabled={cartCount === 0} style={{ alignSelf: "center", marginTop: 8 }} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.rosa, padding: 14, gap: 12 },
  metodos: { borderWidth: 1, borderColor: colors.rosaOscuro, padding: 8, gap: 8 },
  subtitulo: { fontFamily: fonts.textoBold, fontSize: 11, color: "#6b3a69" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metodo: {
    width: "30%", flexGrow: 1, height: 44, borderWidth: 1, borderColor: colors.rosaOscuro,
    borderRadius: 12, alignItems: "center", justifyContent: "center",
  },
  metodoTxt: { fontFamily: fonts.textoBold, fontSize: 12, color: colors.negro },
  input: {
    backgroundColor: colors.rosaClaro, borderWidth: 1, borderColor: colors.rosaOscuro, height: 32,
    paddingHorizontal: 8, fontFamily: fonts.textoBold, fontSize: 12, color: colors.negro, outlineStyle: "none",
  },
  error: { fontFamily: fonts.textoBold, fontSize: 12, color: colors.negro, textAlign: "center" },
});
