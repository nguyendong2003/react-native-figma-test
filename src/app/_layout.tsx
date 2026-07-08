import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppThemeProvider, useTheme } from '@/context/ThemeContext';
import { NavigationBar } from '@/components/NavigationBar';

// Prevent splash screen auto hide
SplashScreen.preventAutoHideAsync();

function SignInHeader() {
  const { theme, activeColors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: theme === 'light' ? activeColors.primary1 : activeColors.background }}>
      <NavigationBar
        title="Sign in"
        showBackButton={true}
        backButtonTint={theme === 'light' ? activeColors.neutral6 : activeColors.text}
        style={{
          backgroundColor: theme === 'light' ? activeColors.primary1 : activeColors.background,
          borderBottomWidth: 0,
        }}
        titleStyle={{
          color: theme === 'light' ? activeColors.neutral6 : activeColors.text,
        }}
      />
    </View>
  );
}

function SignUpHeader() {
  const { theme, activeColors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: theme === 'light' ? activeColors.primary1 : activeColors.background }}>
      <NavigationBar
        title="Sign up"
        showBackButton={true}
        backButtonTint={theme === 'light' ? activeColors.neutral6 : activeColors.text}
        style={{
          backgroundColor: theme === 'light' ? activeColors.primary1 : activeColors.background,
          borderBottomWidth: 0,
        }}
        titleStyle={{
          color: theme === 'light' ? activeColors.neutral6 : activeColors.text,
        }}
      />
    </View>
  );
}

function InnerLayout() {
  const { theme } = useTheme();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="signin" 
          options={{ 
            headerShown: true,
            header: () => <SignInHeader />,
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            headerShown: true,
            header: () => <SignUpHeader />,
            animation: 'slide_from_right'
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
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
    <AppThemeProvider>
      <InnerLayout />
    </AppThemeProvider>
  );
}
