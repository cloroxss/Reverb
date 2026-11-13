import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Screen from "../../../assets/Component/Screen";
import ResumenCompra from "../../../assets/Component/ResumenCompra";
import StarButton from "../../../assets/Component/StarButton";
import { useStore } from "../../../assets/context/StoreContext";
import { useProductos } from "../../../assets/api/productos";
import { colors, fonts, formatoPrecio, useLayout } from "../../../assets/theme";

function Volver() {
  const router = useRouter();
  // Regresa a la pantalla anterior (tienda, creador o artistas); si se abrió directo, va a la tienda.
  const volver = () => (router.canGoBack() ? router.back() : router.replace("/tienda"));
  return (
    <Pressable onPress={volver} style={styles.volver} accessibilityLabel="Volver">
      <Ionicons name="arrow-back" size={20} color={colors.amarillo} />
      <Text style={styles.volverTxt}>Volver</Text>
    </Pressable>
  );
}

export default function DetalleProducto() {
  const { id } = useLocalSearchParams();
  const { isNarrow } = useLayout();
  const { addToCart, addToOutfit } = useStore();
  const { productos, loading } = useProductos();
  const [aviso, setAviso] = useState("");

  let idDecodificado = String(id);
  try { idDecodificado = decodeURIComponent(idDecodificado); } catch {}
  const p = productos.find((x) => [String(id), idDecodificado].includes(String(x.id)));

  const avisar = (msg) => { setAviso(msg); setTimeout(() => setAviso(""), 2000); };

  return (
    <Screen contentStyle={{ flexDirection: isNarrow ? "column" : "row" }}>
      <ResumenCompra style={isNarrow ? null : { flex: 21 }} />

      {loading ? (
        <View style={[styles.foto, { flex: 79 }]}>
          <Volver />
          <ActivityIndicator color={colors.rosa} size="large" style={{ marginTop: 60 }} />
        </View>
      ) : !p ? (
        <View style={[styles.foto, { flex: 79 }]}>
          <Volver />
          <Text style={[styles.label, { textAlign: "center", marginTop: 60 }]}>No encontramos esta prenda.</Text>
        </View>
      ) : (
        <>
          <View style={[styles.foto, isNarrow ? null : { flex: 53 }]}>
            <Volver />
            <View style={isNarrow ? { height: 320, marginTop: 12 } : { flex: 1, marginTop: 12 }}>
              {p.imagen ? <Image source={{ uri: p.imagen }} style={{ width: "100%", height: "100%" }} contentFit="contain" /> : null}
            </View>
          </View>

          <View style={[styles.panel, isNarrow ? null : { flex: 47 }]}>
            <Text style={styles.nombre}>{(p.nombre || "").toUpperCase()}</Text>
            <Text style={styles.precio}>{formatoPrecio(p.precio)}</Text>

            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.valor}>{p.estado}</Text>

            <Text style={styles.label}>Talla:</Text>
            <Text style={styles.valor}>{p.talla}</Text>

            <View style={styles.botones}>
              <StarButton title="Agregar al carrito" small onPress={() => { addToCart(p); avisar("Añadida al carrito"); }} />
              <StarButton title="Añadir al outfit" small onPress={() => { addToOutfit(p); avisar("Añadida al outfit"); }} />
            </View>
            {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  foto: { backgroundColor: colors.negro, padding: 20 },
  volver: {
    flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start",
    borderWidth: 2, borderColor: colors.amarillo, paddingVertical: 4, paddingHorizontal: 12,
  },
  volverTxt: { fontFamily: fonts.textoBold, fontSize: 16, color: colors.amarillo },
  panel: { backgroundColor: colors.negro, borderWidth: 2, borderColor: colors.rosa, padding: 24, alignItems: "center", justifyContent: "center", gap: 6 },
  nombre: { fontFamily: fonts.textoBold, fontSize: 30, color: colors.amarillo, textAlign: "center", fontStyle: "italic" },
  precio: { fontFamily: fonts.textoBold, fontSize: 48, color: colors.amarillo, marginVertical: 18 },
  label: { fontFamily: fonts.textoBold, fontSize: 22, color: colors.amarillo, fontStyle: "italic", marginTop: 14 },
  valor: { fontFamily: fonts.textoBold, fontSize: 22, color: colors.blanco },
  botones: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 34 },
  aviso: { fontFamily: fonts.textoBold, fontSize: 15, color: colors.rosa, marginTop: 14 },
});
