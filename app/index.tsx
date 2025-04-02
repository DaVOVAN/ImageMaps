// app/index.tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import MapView, { LongPressEvent, Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMarkers } from '../context/MarkerContext';
import { RootStackParamList } from '../types';
import globalStyles from '../styles/globalStyles';

const INITIAL_REGION = {
  latitude: 58.005785,
  longitude: 56.232185,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = () => {
  const { markers, addMarker, deleteMarker } = useMarkers();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLongPress = (e: LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    addMarker(latitude, longitude);
  };

  const handleCalloutPress = (markerId: string) => {
    navigation.navigate('MarkerDetails', { id: markerId });
  };

  const handleDeleteMarker = (markerId: string) => {
    Alert.alert(
      "Удалить маркер",
      "Вы уверены, что хотите удалить этот маркер?",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Удалить",
          onPress: () => {
            deleteMarker(markerId);
          },
          style: 'destructive',
        }
      ],
      { cancelable: false }
    );
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
          title={marker.title}
          description={marker.description}
        >
          <Callout onPress={() => handleCalloutPress(marker.id)}>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
};

export default MapScreen;