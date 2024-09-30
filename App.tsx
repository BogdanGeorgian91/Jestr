import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from 'react-error-boundary';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { activateKeepAwakeAsync } from 'expo-keep-awake';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Amplify } from 'aws-amplify';
import { QueryClient } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './src/theme/ThemeContext';
import CustomToast from './src/components/ToastMessages/CustomToast';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorFallback, { LoadingText } from './src/components/ErrorFallback/ErrorFallback';
import { usePushNotifications } from './src/screens/AppNav/Notifications/usePushNotification';
const fontz = { Inter_400Regular, Inter_700Bold};
import awsconfig from './src/aws-exports';

Amplify.configure(awsconfig);


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, 
      staleTime: 2000,
      retry: 0,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const App = () => {
  useReactQueryDevTools(queryClient);
  usePushNotifications(); 

  const [isReady, setIsReady] = useState(false);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  };

  const initializeApp = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      const fontsLoaded = await Font.loadAsync(fontz).then(() => true);
      setIsReady(fontsLoaded);
    } catch (error) {
      console.error('Initialization error', error);
      setIsReady(true);
    }
  };

  useEffect(() => {
    activateKeepAwakeAsync();
    lockOrientation();
    initializeApp();
  }, []);

  if (!isReady) {
    return <LoadingText />;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThemeProvider>
          <NavigationContainer onReady={() => SplashScreen.hideAsync()}>
            <SafeAreaProvider>
              <React.Suspense fallback={<LoadingText />}>
                <AppNavigator />
              </React.Suspense>
            </SafeAreaProvider>
            <CustomToast />
          </NavigationContainer>
        </ThemeProvider>
      </ErrorBoundary>
    </PersistQueryClientProvider>
  );
};



export default App;