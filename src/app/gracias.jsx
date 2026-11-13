import { Text } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../../assets/Component/Screen";
import StarButton from "../../assets/Component/StarButton";
import { colors, fonts, useLayout } from "../../assets/theme";

export default function Gracias() {
  const router = useRouter();
  const { width } = useLayout();
  return (
    <Screen contentStyle={{ alignItems: "center", justifyContent: "center", gap: 40, padding: 24 }}>
      <Text style={{ fontFamily: fonts.textoBold, fontSize: 22, color: colors.rosa }}>Tu pedido está en camino</Text>
      <Text style={{ fontFamily: fonts.titulo, fontSize: Math.min(60, width * 0.11), color: colors.rosa, textAlign: "center" }}>
        GRACIAS POR ELEGIRNOS
      </Text>
      <StarButton title="Volver a la tienda" uppercase onPress={() => router.replace("/tienda")} />
    </Screen>
  );
}
