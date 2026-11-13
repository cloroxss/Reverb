import { useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Screen from "../../assets/Component/Screen";
import StarButton from "../../assets/Component/StarButton";
import ProductCard from "../../assets/Component/ProductCard";
import { useProductos } from "../../assets/api/productos";
import { ARTISTAS, productosDeArtista } from "../../assets/artistas";
import { colors, fonts, useLayout } from "../../assets/theme";

export default function Artistas() {
  const { isNarrow } = useLayout();
  const router = useRouter();
  const [id, setId] = useState(ARTISTAS[0].id);
  const { productos } = useProductos();

  const artista = ARTISTAS.find((a) => a.id === id);
  const lista = productosDeArtista(productos, artista);

  return (
    <Screen contentStyle={{ flexDirection: isNarrow ? "column" : "row" }}>
      {/* Lista de artistas */}
      <View style={[styles.sidebar, isNarrow ? null : { width: 250 }]}>
        <Text style={styles.sideTitulo}>Artistas recomendados</Text>
        <View style={{ gap: 14, alignItems: "stretch", paddingHorizontal: 6 }}>
          {ARTISTAS.map((a) => (
            <StarButton
              key={a.id}
              title={a.nombre}
              small
              variant={a.id === id ? "amarillo" : "negro"}
              onPress={() => setId(a.id)}
            />
          ))}
        </View>
      </View>

      {/* Detalle */}
      <View style={{ flex: 1, padding: 20, gap: 24 }}>
        <View style={{ flexDirection: isNarrow ? "column" : "row", alignItems: "center", gap: 28 }}>
          {/* El PNG del logo ya trae su marco blanco inclinado, así que se muestra tal cual */}
          <View style={artista.imagen ? styles.logoImg : styles.logo}>
            {artista.imagen ? (
              <Image source={artista.imagen} style={{ width: "100%", height: "100%" }} contentFit="contain" />
            ) : (
              <Text style={styles.logoTxt}>{artista.nombre}</Text>
            )}
          </View>

          <View style={{ flex: 1, alignItems: "center", gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
              <Text style={styles.nombre}>{artista.nombre}</Text>
              <Ionicons name="star" size={34} color={colors.estrella} />
            </View>
            <Text style={styles.descripcion}>{artista.descripcion}</Text>
            <View style={styles.linea} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 36, marginTop: 6 }}>
              <StarButton
                title="Escuchar artista"
                small
                onPress={() => artista.url && Linking.openURL(artista.url)}
              />
              <StarButton
                title="Ver conjuntos"
                small
                onPress={() => router.push({ pathname: "/creador_outfits", params: { artista: artista.id } })}
              />
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
          {lista.map((p) => (
            <ProductCard key={p.id} producto={p} style={{ width: isNarrow ? "47%" : "23.5%" }} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sidebar: { backgroundColor: colors.rosa, paddingVertical: 12 },
  sideTitulo: { fontFamily: fonts.textoBold, fontSize: 14, color: colors.negro, textAlign: "center", marginBottom: 18 },
  logo: {
    width: 260, height: 260, backgroundColor: colors.negro, borderWidth: 3, borderColor: colors.blanco,
    alignItems: "center", justifyContent: "center", overflow: "hidden", transform: [{ rotate: "3deg" }],
  },
  logoImg: { width: 260, height: 260 },
  logoTxt: { fontFamily: fonts.titulo, fontSize: 40, color: colors.rosa, textAlign: "center", padding: 12 },
  nombre: { fontFamily: fonts.titulo, fontSize: 58, color: colors.amarillo },
  descripcion: { fontFamily: fonts.textoBold, fontSize: 17, color: colors.amarillo, textAlign: "center", maxWidth: 520 },
  linea: { height: 2, width: "90%", backgroundColor: colors.amarillo },
});
