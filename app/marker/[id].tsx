// app/marker/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useMarkers } from '../../context/MarkerContext';
import { RootStackParamList, ImageData } from '../../types';

const MarkerDetailsScreen = () => {
  const { params } = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { markers, updateMarker } = useMarkers();
  const { id } = params as { id: string };
  
  const marker = markers.find(m => m.id === id);
  const [title, setTitle] = useState(marker?.title || '');
  const [description, setDescription] = useState(marker?.description || '');
  const [images, setImages] = useState<ImageData[]>(marker?.images || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
        };
        setImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить изображение');
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  if (!marker) return null;

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Название маркера</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Введите название..."
          placeholderTextColor="#999"
          style={styles.titleInput}
        />
      </View>

      {/* Описание */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Описание</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Добавьте описание..."
          placeholderTextColor="#999"
          multiline
          style={styles.descriptionInput}
        />
      </View>

      {/* Галерея изображений */}
      <Text style={styles.sectionTitle}>Прикрепленные фото ({images.length})</Text>
      <FlatList
        data={images}
        numColumns={2}
        columnWrapperStyle={styles.galleryWrapper}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <TouchableOpacity 
              onPress={() => setSelectedImage(item.uri)}
              onLongPress={() => handleDeleteImage(item.id)}
            >
              <Image
                source={{ uri: item.uri }}
                style={styles.image}
              />
              <View style={styles.deleteOverlay}>
                <Text style={styles.deleteText}>Удерживайте для удаления</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      {/* Кнопки */}
      <TouchableOpacity 
        onPress={handleAddImage}
        style={styles.addButton}
      >
        <Text style={styles.buttonText}>➕ Добавить фото</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleSave}
        style={styles.saveButton}
      >
        <Text style={styles.buttonText}>Сохранить изменения</Text>
      </TouchableOpacity>

      {/* Модальное окно просмотра фото */}
      <Modal visible={!!selectedImage} transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setSelectedImage(null)}
          >
            <Image
              source={{ uri: selectedImage! }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    color: '#000',
  },
  descriptionInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  galleryWrapper: {
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  deleteOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default MarkerDetailsScreen;