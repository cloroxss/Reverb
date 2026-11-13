import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../theme";

// Botón inclinado con estrella del diseño.
// variant: "amarillo" | "negro" | "contorno"
const VARIANTES = {
  amarillo: { bg: colors.amarillo, fg: colors.negro, borde: colors.negro, sombra: colors.negro },
  negro: { bg: colors.negro, fg: colors.amarillo, borde: colors.negro, sombra: colors.amarillo },
  contorno: { bg: colors.negro, fg: colors.amarillo, borde: colors.rosa, sombra: colors.rosa },
};

export default function StarButton({
  title, onPress, variant = "amarillo", small = false, disabled = false, style, uppercase = false,
}) {
  const v = VARIANTES[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        {
          backgroundColor: v.bg,
          borderColor: v.borde,
          boxShadow: `3px 3px 0px ${v.sombra}`,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.texto, small && { fontSize: 15 }, { color: v.fg }]} numberOfLines={1}>
        {uppercase ? title.toUpperCase() : title}
      </Text>
      <Ionicons name="star-outline" size={small ? 16 : 20} color={v.fg} style={{ marginLeft: 8 }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 4,
    transform: [{ rotate: "-2deg" }, { skewX: "-8deg" }],
  },
  small: { paddingHorizontal: 14, paddingVertical: 8 },
  texto: { fontFamily: fonts.textoBold, fontSize: 19 },
});
