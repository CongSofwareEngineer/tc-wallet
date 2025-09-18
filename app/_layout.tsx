import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@walletconnect/react-native-compat";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { KEY_STORAGE } from '@/constants/storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { saveSecureData } from '@/utils/secureStorage';
import WC from '@/utils/wallet';
import { useCameraPermissions } from 'expo-camera';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [permission, requestPermission] = useCameraPermissions();
  console.log({ permission });

  useEffect(() => {
    (async () => {
      requestPermission()
      const wc = await WC.init()
      wc.getPendingSessionRequests()
      // console.log('WalletKit', wc);
      saveSecureData(KEY_STORAGE.WalletConnect, wc)
    })();
  }, []);


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
