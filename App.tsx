// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MarkersProvider } from './context/MarkerContext';
import MapScreen from './app/index';
import MarkerDetailsScreen from './app/marker/[id]';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MarkersProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Map" 
            component={MapScreen} 
            options={{ title: 'Карта' }} 
          />
          <Stack.Screen 
            name="MarkerDetails" 
            component={MarkerDetailsScreen} 
            options={{ title: 'Детали маркера' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MarkersProvider>
  );
}