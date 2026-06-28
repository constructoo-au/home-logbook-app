import { Platform } from 'react-native';

export const colors = {
  coral: '#FA4516',
  navy: '#21438A',
  cream: '#FDF5DA',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#2C2C2C',
  muted: '#6E6E6E',
  border: '#E6E6E6',
  warmBlack: '#171717',
  success: '#2F7D59',
  surfaceBlue: '#EEF3FA',
  surfaceGreen: '#EDF6F1',
  inkSoft: '#414141',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  pill: 999,
};

export const fontFamily = Platform.select({
  web: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  ios: 'System',
  android: 'sans-serif',
  default: undefined,
});

export const warmShadow = {
  shadowColor: 'rgba(23,23,23,0.28)',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.12,
  shadowRadius: 20,
  elevation: 5,
};

export const softShadow = {
  shadowColor: 'rgba(23,23,23,0.18)',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 14,
  elevation: 3,
};
