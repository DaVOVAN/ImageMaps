import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarkerData } from '../types';
import { useDatabase } from './DatabaseContext';

interface MarkersContextType {
  markers: MarkerData[];
  addMarker: (latitude: number, longitude: number) => Promise<void>;
  updateMarker: (marker: MarkerData) => Promise<void>;
  deleteMarker: (id: string) => Promise<void>;
}

const MarkersContext = createContext<MarkersContextType | undefined>(undefined);

export const MarkersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const { addMarker: addMarkerToDb, deleteMarker: deleteMarkerFromDb, getMarkers, addImage, getMarkerImages, updateMarker: updateMarkerInDb, isLoading: isDatabaseLoading } = useDatabase();

  useEffect(() => {
    const loadMarkers = async () => {
      if (isDatabaseLoading) {
        return; // Не загружаем, пока база данных не инициализирована
      }

      try {
        const loadedMarkers = await getMarkers();
        const markersWithImages = await Promise.all(
          loadedMarkers.map(async (marker) => {
            const images = await getMarkerImages(marker.id);
            return { ...marker, images };
          })
        );
        setMarkers(markersWithImages);
      } catch (error) {
        console.error("Ошибка при загрузке маркеров:", error);
      }
    };

    loadMarkers();
  }, [isDatabaseLoading, getMarkers, getMarkerImages]);

  const addMarker = async (latitude: number, longitude: number) => {
    try {
      const newMarkerId = await addMarkerToDb(latitude, longitude);
      if (newMarkerId) {
        const newMarker: MarkerData = {
          id: newMarkerId,
          coordinate: { latitude, longitude },
          title: 'Новый маркер',
          description: '',
          images: [],
        };
        setMarkers(prev => [...prev, newMarker]);
      } else {
        console.warn("Не удалось получить ID нового маркера");
      }
    } catch (error) {
      console.error("Ошибка при добавлении маркера:", error);
    }
  };

  const updateMarker = async (updatedMarker: MarkerData) => {
    try {
      await updateMarkerInDb(updatedMarker.id, updatedMarker.title, updatedMarker.description);

      setMarkers(prev =>
        prev.map(m => (m.id === updatedMarker.id ? { ...m, title: updatedMarker.title, description: updatedMarker.description } : m))
      );

      console.log("Маркер успешно обновлен в базе данных и локальном состоянии:", updatedMarker);
    } catch (error) {
      console.error("Ошибка при обновлении маркера:", error);
    }
  };


  const deleteMarker = async (id: string) => {
    try {
      await deleteMarkerFromDb(id);
      setMarkers(prev => prev.filter(marker => marker.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении маркера:", error);
    }
  };

  const value: MarkersContextType = {
    markers,
    addMarker,
    updateMarker,
    deleteMarker,
  };

  return (
    <MarkersContext.Provider value={value}>
      {children}
    </MarkersContext.Provider>
  );
};

export const useMarkers = () => {
  const context = useContext(MarkersContext);
  if (!context) {
    throw new Error('useMarkers должен использоваться внутри MarkersProvider');
  }
  return context;
};