import { lightColors, darkColors, AppColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export interface Theme {
  colors: AppColors;
  typography: typeof typography;
  spacing: typeof spacing;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  isDark: true,
};

// Default export is lightTheme optimized for school students
export const theme = lightTheme;
