import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../../assets/Component/Screen";
import StarButton from "../../assets/Component/StarButton";
import { useStore } from "../../assets/context/StoreContext";
import { colors, fonts, useLayout } from "../../assets/theme";

function Campo({ valor, onChange, placeholder, hint, keyboardType }) {
  return (
    <View style={styles.campo}>
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.5)"
        keyboardType={keyboardType}
        style={styles.input}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const VACIO = { nombres: "", apellidos: "", correo: "", telefono: "", direccion: "", piso: "", ciudad: "", departamento: "" };

export default function Envio() {
  const router = useRouter();
  const { isNarrow } = useLayout();
  const { cart, cartTotal, clearCart } = useStore();
  const [f, setF] = useState(VACIO);
  const [error, setError] = useState("");

  const set = (k) => (v) => setF((prev) => ({ ...prev, [k]: v }));

  const finalizar = () => {
    const faltan = ["nombres", "apellidos", "correo", "telefono", "ciudad", "departamento"].filter((k) => !f[k].trim());
    if (faltan.length) return setError("Completa los campos obligatorios.");
    if (!/^\S+@\S+\.\S+$/.test(f.correo)) return setError("Revisa tu correo.");

    // TODO: guardar el pedido en Supabase (ajusta tabla y columnas a tu esquema):
    // await api.post("/Pedido", { ...f, total: cartTotal,
    //   items: cart.map(({ producto, cantidad }) => ({ producto_id: producto.id, cantidad })) });
    clearCart();
    router.replace("/gracias");
  };

  return (
    <Screen contentStyle={{ alignItems: "center", justifyContent: "center", padding: 24 }}>
      <View style={[styles.card, { flexDirection: isNarrow ? "column" : "row" }]}>
        <View style={{ flex: 1, gap: 10 }}>
          <Campo placeholder="Nombres" valor={f.nombres} onChange={set("nombres")} />
          <Campo placeholder="Apellidos" valor={f.apellidos} onChange={set("apellidos")} />
          <View style={{ height: 8 }} />
          <Campo placeholder="Dirección" hint="opcional*" valor={f.direccion} onChange={set("direccion")} />
          <Campo placeholder="Piso | Apartamento" valor={f.piso} onChange={set("piso")} />
          <View style={{ height: 8 }} />
          <Campo placeholder="Ciudad" valor={f.ciudad} onChange={set("ciudad")} />
          <Campo placeholder="Departamento" valor={f.departamento} onChange={set("departamento")} />
        </View>

        <View style={{ flex: 1, gap: 10, justifyContent: "space-between" }}>
          <View style={{ gap: 10 }}>
            <Campo placeholder="Correo" valor={f.correo} onChange={set("correo")} keyboardType="email-address" />
            <Campo placeholder="Teléfono" valor={f.telefono} onChange={set("telefono")} keyboardType="phone-pad" />
          </View>
          <View style={{ alignItems: "center", gap: 8, marginTop: 16 }}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <StarButton title="Realizar compra" variant="negro" small onPress={finalizar} disabled={cart.length === 0} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.rosa, padding: 18, gap: 18, width: "100%", maxWidth: 620 },
  campo: { justifyContent: "center" },
  input: {
    backgroundColor: colors.rosaClaro, borderWidth: 1, borderColor: colors.rosaOscuro, height: 28,
    paddingHorizontal: 8, fontFamily: fonts.textoBold, fontSize: 11, color: colors.negro, outlineStyle: "none",
  },
  hint: { position: "absolute", right: 8, fontFamily: fonts.textoBold, fontSize: 10, color: "#6b3a69" },
  error: { fontFamily: fonts.textoBold, fontSize: 12, color: colors.negro },
});
