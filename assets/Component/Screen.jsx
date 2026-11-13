import { ScrollView, View } from "react-native";
import Topbar from "./Topbar";
import { colors } from "../theme";

// Pantalla base: barra superior + contenido con scroll sobre fondo negro.
export default function Screen({ children, scrollRef, contentStyle }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.negro }}>
      <Topbar />
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={[{ flexGrow: 1 }, contentStyle]}
      >
        {children}
      </ScrollView>
    </View>
  );
}
