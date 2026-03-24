import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from '@/constants/Colors';

export function useTheme(): { colors: ColorScheme; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
  };
}
