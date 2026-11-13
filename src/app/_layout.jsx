import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Oswald_500Medium, Oswald_700Bold } from "@expo-google-fonts/oswald";
import { StoreProvider } from "../../assets/context/StoreContext";

export default function RootLayout() {
  const [cargadas, error] = useFonts({
    RoadRage: require("../../assets/font/RoadRage-Regular.ttf"),
    Oswald_500Medium,
    Oswald_700Bold,
  });

  if (!cargadas && !error) return null;

  return (
    <StoreProvider>
      <StatusBar style="light" />
      <Slot />
    </StoreProvider>
  );
}
