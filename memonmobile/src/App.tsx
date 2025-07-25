import { Provider } from 'react-redux';
import store, { persistor } from '@/src/store/store';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import '../global.css';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
