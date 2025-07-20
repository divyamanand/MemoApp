import { Stack } from 'expo-router';
import "./global.css"
import { Provider } from 'react-redux';
import store from '@/store/store';

export default function RootLayout() {

  return (
    <Provider store={store}>
      <Stack screenOptions={{headerShown: false}}/>
    </Provider>
  );
}