import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet, Modal, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useMarkers } from '../../context/MarkerContext';
import { useDatabase } from '../../context/DatabaseContext';
import { RootStackParamList, ImageData } from '../../types';
import globalStyles from '../../styles/globalStyles';

const NUM_COLUMNS = 3; // Количество фотографий в одной строке

const MarkerDetailsScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { markers, updateMarker, deleteMarker } = useMarkers();
    const { addImage, deleteImage, getMarkerImages } = useDatabase();
    const { id } = params as { id: string };

    const marker = markers.find(m => m.id === id);
    const [title, setTitle] = useState(marker?.title || '');
    const [description, setDescription] = useState(marker?.description || '');
    const [images, setImages] = useState<ImageData[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const loadImages = async () => {
            if (marker) {
                try {
                    const loadedImages = await getMarkerImages(marker.id);
                    setImages(loadedImages);
                } catch (error) {
                    console.error("Ошибка при загрузке изображений:", error);
                    Alert.alert("Ошибка", "Не удалось загрузить изображения.");
                }
            }
        };

        loadImages();
    }, [marker]);

    useEffect(() => {
        if (!marker) Alert.alert('Ошибка', 'Маркер не найден');
    }, [marker]);

    const handleSave = () => {
        if (!marker) return;
        updateMarker({
            ...marker,
            title,
            description,
            images,
        });
        navigation.goBack();
    };

    const handleAddImage = async () => {
        if (!marker) return;
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 1,
            });
            if (!result.canceled) {
              const newImageUri = result.assets[0].uri;
              try {
                  await addImage(marker.id, newImageUri);
                  setImages(prev => [...prev, { id: Date.now().toString(), uri: newImageUri }]);
                  Alert.alert("Успех", "Изображение добавлено!");
              } catch (error) {
                  console.error("Ошибка при добавлении изображения в базу данных:", error);
                  Alert.alert("Ошибка", "Не удалось добавить изображение в базу данных.");
              }
          }
      } catch (error) {
          Alert.alert('Ошибка', 'Не удалось загрузить изображение');
      }
  };

  const handleDeleteImage = async (imageId: string) => {
      if (!marker) return;
      try {
          await deleteImage(imageId);
          setImages(prev => prev.filter(img => img.id !== imageId));
          Alert.alert("Успех", "Изображение удалено!");
      } catch (error) {
          console.error("Ошибка при удалении изображения из базы данных:", error);
          Alert.alert("Ошибка", "Не удалось удалить изображение из базы данных.");
      }
  };

  const handleDeleteMarker = () => {
      if (!marker) return;

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
                  onPress: async () => {
                      try {
                          await deleteMarker(marker.id);
                          navigation.goBack();
                      } catch (error: any) {
                          console.error("Ошибка при удалении маркера:", error.message);
                          Alert.alert("Ошибка", "Не удалось удалить маркер.");
                      }
                  },
                  style: 'destructive',
              }
          ],
          { cancelable: false }
      );
  };

  if (!marker) return null;

  return (
      <ScrollView style={globalStyles.markerDetailsContainer}
      contentContainerStyle={globalStyles.scrollViewContent}
      >
          {/* Заголовок */}
          <View style={globalStyles.markerDetailsInputContainer}>
              <Text style={globalStyles.markerDetailsLabel}>Название маркера</Text>
              <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Введите название..."
                  placeholderTextColor="#999"
                  style={globalStyles.markerDetailsTitleInput}
              />
          </View>

          {/* Описание */}
          <View style={globalStyles.markerDetailsInputContainer}>
              <Text style={globalStyles.markerDetailsLabel}>Описание</Text>
              <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Добавьте описание..."
                  placeholderTextColor="#999"
                  multiline
                  style={globalStyles.markerDetailsDescriptionInput}
              />
          </View>

          {/* Координаты */}
          <View style={globalStyles.markerDetailsInputContainer}>
              <Text style={globalStyles.markerDetailsLabel}>Координаты</Text>
              <Text style={globalStyles.markerDetailsCoordinateText}>
                  Широта: {marker.coordinate.latitude}
              </Text>
              <Text style={globalStyles.markerDetailsCoordinateText}>
              Долгота: {marker.coordinate.longitude}
                </Text>
            </View>

            {/* Галерея изображений */}
            <Text style={globalStyles.markerDetailsSectionTitle}>Прикрепленные фото ({images.length})</Text>
            <View style={globalStyles.markerDetailsGalleryWrapper}>
                {images.map((item) => (
                    <View key={item.id} style={globalStyles.markerDetailsImageContainer}>
                        <TouchableOpacity
                            onPress={() => setSelectedImage(item.uri)}
                            onLongPress={() => handleDeleteImage(item.id)}
                        >
                            <Image
                                source={{ uri: item.uri }}
                                style={globalStyles.markerDetailsImage}
                            />
                            <View style={globalStyles.markerDetailsDeleteOverlay}>
                                <Text style={globalStyles.markerDetailsDeleteText}>Удерживайте для удаления</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Кнопки */}
            <TouchableOpacity
                onPress={handleAddImage}
                style={globalStyles.markerDetailsAddButton}
            >
                <Text style={globalStyles.markerDetailsButtonText}>+ Добавить фото +</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSave}
                style={globalStyles.markerDetailsSaveButton}
            >
                <Text style={globalStyles.markerDetailsButtonText}>Сохранить изменения</Text>
            </TouchableOpacity>

            {/* Кнопка удаления маркера */}
            <TouchableOpacity
                onPress={handleDeleteMarker}
                style={[globalStyles.markerDetailsDeleteButton]}
            >
                <Text style={globalStyles.markerDetailsButtonText}>Удалить маркер</Text>
            </TouchableOpacity>

            {/* Окно просмотра фото */}
            <Modal visible={!!selectedImage} transparent>
                <View style={globalStyles.markerDetailsModalContainer}>
                    <TouchableOpacity
                        style={globalStyles.markerDetailsModalBackground}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Image source={{ uri: selectedImage! }}
                            style={globalStyles.markerDetailsFullscreenImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default MarkerDetailsScreen;