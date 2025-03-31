// app/index.tsx
import React from 'react';
import { Alert } from 'react-native';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMarkers } from '../context/MarkerContext';
import { RootStackParamList } from '../types';
import globalStyles from '../styles/globalStyles'; // Import styles

const INITIAL_REGION = {
  latitude: 58.005785,
  longitude: 56.232185,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = () => {
  const { markers, addMarker } = useMarkers();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLongPress = (e: LongPressEvent) => {
    const newMarker = {
      id: Date.now().toString(),
      coordinate: e.nativeEvent.coordinate,
      title: 'Новый маркер',
      description: '',
      images: [],
    };
    addMarker(newMarker);
  };

  // Упрощенный обработчик нажатия
  const handleMarkerPress = (markerId: string) => {
    navigation.navigate('MarkerDetails', { id: markerId });
  };

  return (
    <MapView
      style={globalStyles.mapScreenContainer}
      initialRegion={INITIAL_REGION}
      onLongPress={handleLongPress}
      onMapReady={() => console.log('Map loaded')}
    >
      {markers.map(marker => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          onPress={() => handleMarkerPress(marker.id)}
        />
      ))}
    </MapView>
  );
};

export default MapScreen;