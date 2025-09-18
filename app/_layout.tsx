import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@walletconnect/react-native-compat";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
// Dev tooling (safe to keep; no-op in production if dependency missing)
import '@/utils/debug/reactotron';

import { useColorScheme } from '@/hooks/use-color-scheme';
import WC from '@/utils/walletEvm';
import { useCameraPermissions } from 'expo-camera';
import { useEffect } from 'react';



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [, requestPermission] = useCameraPermissions();
  console.log({ colorScheme });

  useEffect(() => {
    (async () => {
      requestPermission()
      const wc = await WC.init()
      wc.getPendingSessionRequests()
      const wallet = await WC.createWallet()
      console.log({ wallet });

    })();
  }, [requestPermission]);


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack  >
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
        {/* <Stack.Screen name="/" options={{ headerShown: false }} /> */}

        {/* <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />
        <Stack.Screen name="create-wallet" options={{ headerShown: false }} />
        <Stack.Screen name="import-wallet" options={{ headerShown: false }} />
        <Stack.Screen name="connect-dapp" options={{ headerShown: false }} />
        <Stack.Screen name="backup" options={{ headerShown: false }} />
        <Stack.Screen name="wallet" options={{ headerShown: false }} /> */}
        <Stack.Screen name="approve/index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />

    </ThemeProvider>
  );
}
