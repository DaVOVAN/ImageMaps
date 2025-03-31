// types.ts
export interface ImageData {
    id: string;
    uri: string;
  }
  
  export interface MarkerData {
    id: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title: string;
    description: string;
    images: ImageData[];
  }
  
  export type RootStackParamList = {
    Map: undefined;
    MarkerDetails: { id: string };
  };