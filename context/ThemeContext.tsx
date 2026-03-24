import React, { createContext, useContext, useState } from "react";
import { Colors, ColorScheme } from "@/constants/Colors";

type ThemeContextType = {
	isDark: boolean;
	colors: ColorScheme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	isDark: false,
	colors: Colors.light,
	toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [isDark, setIsDark] = useState(false); // light by default

	function toggleTheme() {
		setIsDark((prev) => !prev);
	}

	return (
		<ThemeContext.Provider
			value={{
				isDark,
				colors: isDark ? Colors.dark : Colors.light,
				toggleTheme,
			}}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => useContext(ThemeContext);
