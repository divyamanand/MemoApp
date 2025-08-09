import { Provider } from 'react-redux';
import store, { persistor } from '@/src/store/store';

import {
  NavigationContainer,
  DefaultTheme as NavTheme,
} from '@react-navigation/native';
import {
  PaperProvider,
  MD3LightTheme as PaperDefault,
} from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';

import AppNavigator from './navigation/AppNavigator';
import '../global.css';

export const StudyLightTheme = {
  ...PaperDefault,
  version: 3,
  roundness: 10,
  colors: {
    ...PaperDefault.colors,
    primary: '#4F86F7',
    onPrimary: '#FFFFFF',
    primaryContainer: '#DCE8FF',
    onPrimaryContainer: '#0E2A6B',

    secondary: '#7BCEDB',
    onSecondary: '#053B44',
    secondaryContainer: '#DDF5F8',
    onSecondaryContainer: '#0C3137',

    tertiary: '#FFC15A',
    onTertiary: '#3E2A00',
    tertiaryContainer: '#FFF1D4',
    onTertiaryContainer: '#3A2A07',

    background: '#FFFFFF',
    onBackground: '#1B1B1F',
    surface: '#FFFFFF',
    onSurface: '#1B1B1F',

    surfaceVariant: '#E7EAF0',
    onSurfaceVariant: '#44474F',
    outline: '#787B82',

    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',

    inverseSurface: '#2F3033',
    inverseOnSurface: '#F1F0F4',
    inversePrimary: '#AFC6FF',
    backdrop: 'rgba(27,27,31,0.4)',
    surfaceDisabled: 'rgba(27,27,31,0.12)',
    onSurfaceDisabled: 'rgba(27,27,31,0.38)',

    elevation: {
      level0: 'transparent',
      level1: '#F6F8FC',
      level2: '#EFF3FA',
      level3: '#EAF0FA',
      level4: '#E6EDFA',
      level5: '#E2EBFA',
    },
  },
} as const;

const NavigationLightTheme = {
  ...NavTheme,
  colors: {
    ...NavTheme.colors,
    primary: StudyLightTheme.colors.primary,
    background: StudyLightTheme.colors.background,
    card: StudyLightTheme.colors.surface,
    text: StudyLightTheme.colors.onSurface,
    border: StudyLightTheme.colors.outline,
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={StudyLightTheme}>
          <NavigationContainer theme={NavigationLightTheme}>
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
