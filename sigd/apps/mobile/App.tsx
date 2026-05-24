/**
 * App.tsx — Entry point da aplicação SIGD
 *
 * Configura os providers globais:
 * - QueryClientProvider (@tanstack/react-query)
 * - GestureHandlerRootView (react-native-gesture-handler)
 * - SafeAreaProvider (react-native-safe-area-context)
 * - NavigationContainer (@react-navigation/native)
 * - AppNavigator (RBAC switch por role JWT)
 *
 * Hidrata a auth store ao arrancar (restaura sessão persistida).
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuthStore } from './src/stores/authStore';
import { Colors } from './src/constants/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent(): React.JSX.Element {
  const [isReady, setIsReady] = useState(false);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    const init = async (): Promise<void> => {
      await hydrate();
      setIsReady(true);
    };
    void init();
  }, [hydrate]);

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <AppContent />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splash: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
