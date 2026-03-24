import { Tabs } from "expo-router";
import { TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
	const { colors, isDark, toggleTheme } = useTheme();

	const ThemeToggle = () => (
		<TouchableOpacity
			onPress={toggleTheme}
			style={{ marginRight: 16, padding: 4 }}
			activeOpacity={0.7}>
			<Feather name={isDark ? "sun" : "moon"} size={20} color={colors.text} />
		</TouchableOpacity>
	);

	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				headerStyle: {
					backgroundColor: colors.surface,
					borderBottomColor: colors.border,
					borderBottomWidth: 1,
					elevation: 0,
					shadowOpacity: 0,
				},
				headerTitleStyle: {
					fontFamily: "Hind-Siliguri-Bold",
					fontSize: 18,
					color: colors.text,
				},
				headerRight: () => <ThemeToggle />,
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.textTertiary,
				tabBarStyle: {
					backgroundColor: colors.tabBar,
					borderTopColor: colors.tabBarBorder,
					borderTopWidth: 1,
					paddingBottom: Platform.OS === "ios" ? 24 : 8,
					paddingTop: 8,
					height: Platform.OS === "ios" ? 84 : 64,
				},
				tabBarLabelStyle: {
					fontFamily: "Hind-Siliguri-Medium",
					fontSize: 11,
				},
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "রূপান্তর",
					tabBarIcon: ({ color, size }) => (
						<Feather name="refresh-cw" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "ইতিহাস",
					tabBarIcon: ({ color, size }) => (
						<Feather name="clock" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "প্রোফাইল",
					tabBarIcon: ({ color, size }) => (
						<Feather name="user" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
