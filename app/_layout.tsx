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
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { StyleSheet } from "react-native";

SplashScreen.preventAutoHideAsync();

function AppStack() {
	const { isDark, colors } = useTheme();
	return (
		<>
			<StatusBar style={isDark ? "light" : "dark"} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: colors.background },
				}}>
				<Stack.Screen name="index" />
				<Stack.Screen name="(auth)" />
				<Stack.Screen name="(tabs)" />
			</Stack>
		</>
	);
}

export default function RootLayout() {
	const [loaded] = useFonts({
		"Hind-Siliguri-Regular": HindSiliguri_400Regular,
		"Hind-Siliguri-Medium": HindSiliguri_500Medium,
		"Hind-Siliguri-SemiBold": HindSiliguri_600SemiBold,
		"Hind-Siliguri-Bold": HindSiliguri_700Bold,
	});

	useEffect(() => {
		if (loaded) SplashScreen.hideAsync();
	}, [loaded]);

	if (!loaded) return null;

	return (
		<GestureHandlerRootView style={StyleSheet.absoluteFill}>
			<ThemeProvider>
				<AuthProvider>
					<AppStack />
				</AuthProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
