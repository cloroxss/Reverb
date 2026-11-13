import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Screen from "../../assets/Component/Screen";
import ProductCard from "../../assets/Component/ProductCard";
import { useStore } from "../../assets/context/StoreContext";
import { useProductos } from "../../assets/api/productos";
import { CATEGORIAS, claveDeProducto, normalizarTexto } from "../../assets/categorias";
import { colors, fonts, useLayout } from "../../assets/theme";

export default function Tienda() {
  const router = useRouter();
  const { addToCart } = useStore();
  const { productos, loading, error } = useProductos();
  const { width, isNarrow } = useLayout();

  const [texto, setTexto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState(null);

  // Rejilla plana (como en el diseño); si hay una categoría elegida, solo esa.
  const buscadas = productos.filter((p) => normalizarTexto(p.nombre).includes(normalizarTexto(busqueda)));
  const lista = categoria ? buscadas.filter((p) => claveDeProducto(p) === categoria) : buscadas;

  // Miniatura de cada categoría: la foto de un producto real de esa categoría (si hay); si no, el dibujo.
  const portada = (key) => productos.find((p) => claveDeProducto(p) === key && p.imagen)?.imagen;

  const columnas = width > 900 ? 4 : width > 600 ? 3 : 2;
  const anchoLado = isNarrow ? 0 : 190;
  const anchoCard = `${100 / columnas - 2}%`;

  return (
    <Screen>
      {/* Buscador */}
      <View style={styles.buscador}>
        <View style={styles.inputWrap}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={() => setBusqueda(texto)}
            placeholder="Busca una prenda:"
            placeholderTextColor="rgba(0,0,0,0.6)"
            style={styles.input}
            returnKeyType="search"
          />
        </View>
        <Pressable onPress={() => setBusqueda(texto)} style={styles.lupa} accessibilityLabel="Buscar">
          <Ionicons name="search" size={18} color={colors.negro} />
        </Pressable>
      </View>

      <View style={{ flexDirection: isNarrow ? "column" : "row", flex: 1, padding: 16, gap: 16 }}>
        {/* Categorías */}
        <View style={isNarrow ? null : { width: anchoLado }}>
          <Text style={styles.tituloCat}>Categorias</Text>
          {categoria && (
            <Pressable onPress={() => setCategoria(null)} style={{ marginBottom: 10 }}>
              <Text style={styles.verTodo}>← Ver todas</Text>
            </Pressable>
          )}
          <View style={isNarrow ? styles.catsFila : styles.catsCol}>
            {CATEGORIAS.map((c) => {
              const activa = categoria === c.key;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setCategoria(activa ? null : c.key)}
                  style={[styles.cat, activa && { backgroundColor: colors.rosa }]}
                >
                  <Image
                    source={portada(c.key) ? { uri: portada(c.key) } : c.icon}
                    style={styles.catImg}
                    contentFit={portada(c.key) ? "cover" : "contain"}
                  />
                  <Text style={styles.catTxt}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Productos */}
        <View style={{ flex: 1 }}>
          {loading && <ActivityIndicator color={colors.rosa} size="large" style={{ marginTop: 40 }} />}
          {!loading && error && <Text style={styles.aviso}>No se pudieron cargar las prendas.</Text>}
          {!loading && !error && lista.length === 0 && (
            <Text style={styles.aviso}>
              {categoria ? "No hay prendas en esta categoría." : "No hay prendas para mostrar."}
            </Text>
          )}
          <View style={styles.grid}>
            {lista.map((p) => (
              <ProductCard
                key={p.id}
                producto={p}
                accion="carro"
                onAdd={() => addToCart(p)}
                onPress={() => router.push(`/producto/${encodeURIComponent(p.id)}`)}
                style={{ width: anchoCard }}
              />
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  buscador: {
    flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.rosa,
    paddingVertical: 6, paddingHorizontal: 16, borderBottomWidth: 2, borderColor: colors.rosaOscuro,
  },
  inputWrap: { flex: 1, backgroundColor: colors.blanco, borderRadius: 16, paddingHorizontal: 12, height: 26, justifyContent: "center" },
  input: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.negro, padding: 0, outlineStyle: "none" },
  lupa: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.blanco, alignItems: "center", justifyContent: "center" },
  tituloCat: { fontFamily: fonts.titulo, fontSize: 40, color: colors.amarillo, marginBottom: 10 },
  catsCol: { gap: 10, alignItems: "flex-start" },
  catsFila: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  cat: { width: 100, backgroundColor: colors.blanco, borderWidth: 2, borderColor: colors.rosa, padding: 4, alignItems: "center" },
  catImg: { width: 88, height: 88 },
  catTxt: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.negro, marginTop: 2 },
  verTodo: { fontFamily: fonts.textoBold, fontSize: 14, color: colors.rosa },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  aviso: { fontFamily: fonts.textoBold, fontSize: 16, color: colors.rosa, marginTop: 24 },
});
