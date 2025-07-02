import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { SignupProvider } from '../context/SignupContext';

SplashScreen.preventAutoHideAsync();

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return (
    <StatusBar 
      style={isDark ? "light" : "dark"} 
      backgroundColor="transparent" 
      translucent 
    />
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <SignupProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="auth/signup" />
                <Stack.Screen name="auth/signup-email" />
                <Stack.Screen name="auth/signup-personal" />
                <Stack.Screen name="auth/signup-verification" />
                <Stack.Screen name="auth/signin" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(marketplace)" options={{ headerShown: false }} />
              </Stack>
              <ThemedStatusBar />
            </GestureHandlerRootView>
          </SignupProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}