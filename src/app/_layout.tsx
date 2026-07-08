import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Stack } from 'expo-router';

// Prevent splash screen auto hide
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/poppins/Poppins-Bold.ttf'),
    'Poppins-Black': require('../../assets/fonts/poppins/Poppins-Black.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
