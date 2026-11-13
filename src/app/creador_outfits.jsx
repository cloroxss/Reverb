import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import Screen from "../../assets/Component/Screen";
import ResumenCompra from "../../assets/Component/ResumenCompra";
import ProductCard from "../../assets/Component/ProductCard";
import StarButton from "../../assets/Component/StarButton";
import { useStore } from "../../assets/context/StoreContext";
import { useProductos } from "../../assets/api/productos";
import { CATEGORIAS, claveDeProducto } from "../../assets/categorias";
import { ARTISTAS, productosDeArtista } from "../../assets/artistas";
import { colors, fonts, useLayout } from "../../assets/theme";

const PRENDAS = CATEGORIAS.filter((c) => c.grupo === "prendas");
const ACCESORIOS = CATEGORIAS.filter((c) => c.grupo === "accesorios");

// Ícono del outfit. Vacío: dibujo de línea. Con prenda elegida: su foto (o un ✓ si no tiene foto)
// y el nombre debajo. El botón "−" la quita del outfit.
function Ficha({ cat, activa, item, onPress, onQuitar }) {
  return (
    <View style={{ width: 88, alignItems: "center" }}>
      <View>
        <Pressable
          onPress={onPress}
          accessibilityLabel={cat.label}
          style={[styles.ficha, activa && { backgroundColor: colors.amarillo }]}
        >
          {item?.imagen ? (
            <Image source={{ uri: item.imagen }} style={{ width: 76, height: 76 }} contentFit="cover" />
          ) : (
            <>
              <Image
                source={cat.icon}
                style={{ width: 64, height: 64, opacity: item ? 0.35 : 1 }}
                contentFit="contain"
              />
              {item ? <Text style={styles.check}>✓</Text> : null}
            </>
          )}
        </Pressable>
        {item ? (
          <Pressable onPress={onQuitar} style={styles.quitar} accessibilityLabel={`Quitar ${item.nombre}`}>
            <Text style={styles.quitarTxt}>−</Text>
          </Pressable>
        ) : null}
      </View>
      {item ? (
        <Text numberOfLines={1} style={styles.caption}>{item.nombre}</Text>
      ) : null}
    </View>
  );
}

export default function CreadorOutfits() {
  const router = useRouter();
  const { artista: artistaId } = useLocalSearchParams(); // viene de Artistas > "Ver conjuntos"
  const { isNarrow } = useLayout();
  const { addToOutfit, removeFromOutfit, saveOutfit, loadOutfit, outfit } = useStore();
  const { productos, loading, error } = useProductos();
  const [seleccion, setSeleccion] = useState("chaqueta"); // como en el diseño, abre en "Abrigos"
  const [aviso, setAviso] = useState("");

  // Prenda elegida por categoría (una por ícono)
  const porClave = {};
  outfit.forEach((p) => { porClave[claveDeProducto(p)] = p; });

  const artista = ARTISTAS.find((a) => a.id === artistaId);
  const cat = CATEGORIAS.find((c) => c.key === seleccion);

  // Catálogo del panel derecho: del artista (si venimos de "Ver conjuntos") o general,
  // y filtrado por el ícono elegido.
  const base = artista ? productosDeArtista(productos, artista) : productos;
  const lista = cat
    ? base.filter((p) => claveDeProducto(p) === cat.key)
    : artista
      ? base
      : productos.slice(0, 6); // "Conjuntos recomendados": relleno hasta tener una tabla de conjuntos
  const titulo = cat ? cat.titulo : artista ? `CONJUNTOS DE ${artista.nombre.toUpperCase()}` : "CONJUNTOS RECOMENDADOS";
  const verTodo = () => router.replace("/creador_outfits");

  const alternar = (key) => setSeleccion((s) => (s === key ? null : key));
  const guardar = () => { saveOutfit(); setAviso(outfit.length ? "Estilo guardado" : "Tu outfit está vacío"); };
  const cargar = () => setAviso(loadOutfit() ? "Estilo cargado" : "No tienes un estilo guardado");
  const renderFichas = (cats) =>
    cats.map((c) => (
      <Ficha
        key={c.key}
        cat={c}
        activa={seleccion === c.key}
        item={porClave[c.key]}
        onPress={() => alternar(c.key)}
        onQuitar={() => removeFromOutfit(porClave[c.key].id)}
      />
    ));

  return (
    <Screen contentStyle={{ flexDirection: isNarrow ? "column" : "row" }}>
      <ResumenCompra style={isNarrow ? null : { flex: 21 }} />

      {/* Iconos del outfit */}
      <View style={[styles.centro, isNarrow ? null : { flex: 32 }]}>
        <View style={styles.columnas}>
          <View style={styles.columna}>
            <Text style={styles.subtitulo}>Prendas</Text>
            {renderFichas(PRENDAS)}
          </View>
          <View style={styles.columna}>
            <Text style={styles.subtitulo}>Accesorios</Text>
            {renderFichas(ACCESORIOS)}
          </View>
        </View>

        <View style={styles.acciones}>
          <StarButton title="Guardar estilo" small onPress={guardar} />
          <StarButton title="Cargar estilo" variant="contorno" small onPress={cargar} />
        </View>
        {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
      </View>

      {/* Productos de la categoría elegida */}
      <View style={[styles.panel, isNarrow ? null : { flex: 47 }]}>
        <Text style={styles.titulo}>{titulo}</Text>
        {artista ? (
          <Pressable onPress={verTodo} style={{ alignSelf: "center", marginBottom: 12 }}>
            <Text style={styles.verTodo}>Recomendado por {artista.nombre} · ← Ver todo el catálogo</Text>
          </Pressable>
        ) : null}
        {loading && <ActivityIndicator color={colors.rosa} size="large" style={{ marginTop: 30 }} />}
        {!loading && error && <Text style={styles.vacio}>No se pudieron cargar las prendas.</Text>}
        {!loading && !error && lista.length === 0 && (
          <Text style={styles.vacio}>
            {artista ? `${artista.nombre} no tiene prendas en esta categoría.` : "No hay prendas en esta categoría."}
          </Text>
        )}
        <View style={styles.grid}>
          {lista.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              accion="mas"
              onAdd={() => addToOutfit(p)}
              onPress={() => router.push(`/producto/${encodeURIComponent(p.id)}`)}
              style={{ width: "48%" }}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centro: { padding: 16, backgroundColor: colors.negro, minHeight: 420 },
  columnas: { flexDirection: "row", justifyContent: "space-between", flex: 1 },
  columna: { gap: 14, alignItems: "center" },
  subtitulo: { fontFamily: fonts.textoBold, fontSize: 14, color: colors.amarillo },
  ficha: { width: 88, height: 88, backgroundColor: colors.rosa, alignItems: "center", justifyContent: "center" },
  check: { position: "absolute", fontFamily: fonts.textoBold, fontSize: 40, color: colors.negro },
  quitar: {
    position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.amarillo, borderWidth: 2, borderColor: colors.negro, alignItems: "center", justifyContent: "center",
  },
  quitarTxt: { fontFamily: fonts.textoBold, fontSize: 16, lineHeight: 18, color: colors.negro },
  caption: { fontFamily: fonts.textoBold, fontSize: 11, color: colors.rosa, marginTop: 3, maxWidth: 88 },
  acciones: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 18, gap: 10 },
  aviso: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.rosa, textAlign: "center", marginTop: 10 },
  panel: { backgroundColor: colors.negro, borderWidth: 2, borderColor: colors.rosa, padding: 14 },
  titulo: { fontFamily: fonts.titulo, fontSize: 34, color: colors.amarillo, textAlign: "center", marginBottom: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  verTodo: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.rosa },
  vacio: { fontFamily: fonts.textoBold, fontSize: 16, color: colors.rosa, textAlign: "center", marginTop: 20 },
});
