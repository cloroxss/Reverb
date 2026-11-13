import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { colors, fonts, useLayout } from "../theme";

const LINKS = [
  { title: "Home", href: "/", activa: (p) => p === "/" },
  { title: "Tienda", href: "/tienda", activa: (p) => p.startsWith("/tienda") },
  { title: "Creador de outfits", href: "/creador_outfits",
    activa: (p) => p.startsWith("/creador_outfits") || p.startsWith("/producto") },
  { title: "Artistas", href: "/artistas", activa: (p) => p.startsWith("/artistas") },
];

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isPhone } = useLayout();
  const fontSize = isPhone ? 12 : 17;

  return (
    <View style={styles.container}>
      {LINKS.map((l) => {
        const activa = l.activa(pathname);
        return (
          <Pressable
            key={l.href}
            onPress={() => router.push(l.href)}
            style={[styles.item, activa && { backgroundColor: colors.rosa }]}
          >
            <Text style={[styles.texto, { fontSize, color: activa ? colors.negro : colors.rosa }]}>
              {l.title}
            </Text>
          </Pressable>
        );
      })}
      <Pressable
        onPress={() => router.push("/carrito")}
        style={[styles.item, { backgroundColor: colors.amarillo, flex: 1.1 }]}
      >
        <Text style={[styles.texto, { fontSize, color: colors.negro }]}>Carrito</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.negro,
    borderWidth: 2,
    borderColor: colors.rosa,
    height: 36,
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center" },
  texto: { fontFamily: fonts.textoBold },
});
