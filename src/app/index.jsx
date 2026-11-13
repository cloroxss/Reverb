import { Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Screen from "../../assets/Component/Screen";
import StarButton from "../../assets/Component/StarButton";
import { colors, fonts, useLayout } from "../../assets/theme";

export default function Index() {
  const router = useRouter();
  const { width, isNarrow } = useLayout();

  return (
    <Screen contentStyle={{ alignItems: "center", justifyContent: "center", paddingVertical: 24, gap: 18 }}>
      <Text style={{ fontFamily: fonts.titulo, color: colors.rosa, fontSize: Math.min(72, width * 0.13) }}>
        BIENVENID@!
      </Text>

      <Image
        source={require("../../assets/images/LogotipoREVERB.png")}
        style={{ width: 280, height: 222 }}
        contentFit="contain"
      />

      <Text style={{ fontFamily: fonts.textoBold, color: colors.rosa, fontSize: 24 }}>¿Que estas buscando?</Text>

      <View
        style={{
          flexDirection: isNarrow ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isNarrow ? 24 : 70,
          marginTop: 8,
        }}
      >
        <StarButton title="Arma tu estilo" uppercase onPress={() => router.push("/creador_outfits")} />
        <StarButton title="Busca una prenda" uppercase onPress={() => router.push("/tienda")} />
        <StarButton title="Conoce artistas" uppercase onPress={() => router.push("/artistas")} />
      </View>
    </Screen>
  );
}
