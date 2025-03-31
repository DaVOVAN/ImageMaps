// context/MarkersContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { MarkerData } from '../types';

interface MarkersContextType {
  markers: MarkerData[];
  addMarker: (marker: MarkerData) => void;
  updateMarker: (marker: MarkerData) => void;
}

const MarkersContext = createContext<MarkersContextType>({
  markers: [],
  addMarker: () => {},
  updateMarker: () => {},
});

export const MarkersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const addMarker = (marker: MarkerData) => {
    setMarkers(prev => [...prev, marker]);
  };

  const updateMarker = (updatedMarker: MarkerData) => {
    setMarkers(prev => 
      prev.map(m => m.id === updatedMarker.id ? updatedMarker : m)
    );
  };

  return (
    <MarkersContext.Provider value={{ markers, addMarker, updateMarker }}>
      {children}
    </MarkersContext.Provider>
  );
};

export const useMarkers = () => useContext(MarkersContext);