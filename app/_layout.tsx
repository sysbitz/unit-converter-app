import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
	useFonts,
	HindSiliguri_400Regular,
	HindSiliguri_500Medium,
	HindSiliguri_600SemiBold,
	HindSiliguri_700Bold,
} from "@expo-google-fonts/hind-siliguri";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";
import { useColorScheme, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded] = useFonts({
		"Hind-Siliguri-Regular": HindSiliguri_400Regular,
		"Hind-Siliguri-Medium": HindSiliguri_500Medium,
		"Hind-Siliguri-SemiBold": HindSiliguri_600SemiBold,
		"Hind-Siliguri-Bold": HindSiliguri_700Bold,
	});

	const scheme = useColorScheme();
	const isDark = scheme === "dark";
	const colors = isDark ? Colors.dark : Colors.light;

	useEffect(() => {
		if (loaded) SplashScreen.hideAsync();
	}, [loaded]);

	if (!loaded) return null;

	return (
		<GestureHandlerRootView style={StyleSheet.absoluteFill}>
			<AuthProvider>
				<StatusBar style={isDark ? "light" : "dark"} />
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: { backgroundColor: colors.background },
					}}>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="(auth)" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
