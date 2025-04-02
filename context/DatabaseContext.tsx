import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { MarkerData, ImageData } from '../types';

interface DatabaseContextType {
    addMarker: (latitude: number, longitude: number) => Promise<string | null>;
    deleteMarker: (id: string) => Promise<void>;
    getMarkers: () => Promise<MarkerData[]>;
    addImage: (markerId: string, uri: string) => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
    getMarkerImages: (markerId: string) => Promise<ImageData[]>;
    updateMarker: (id: string, title: string, description: string) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Open the database
const openDatabase = async (dbName: string): Promise<SQLite.SQLiteDatabase> => {
    try {
        const db = SQLite.openDatabaseSync(dbName);
        return db;
    } catch (error: any) {
        console.error("Ошибка при открытии базы данных:", error.message);
        throw error;
    }
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initializeDatabase = useCallback(async () => {
        setIsLoading(true);
        try {
            const database = await openDatabase('ImageMaps.db');
            setDb(database);

            // Create tables (only if they don't exist)
            await database.runAsync(`
                CREATE TABLE IF NOT EXISTS markers (
                    id TEXT PRIMARY KEY NOT NULL,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    title TEXT,
                    description TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            await database.runAsync(`
                CREATE TABLE IF NOT EXISTS marker_images (
                    id TEXT PRIMARY KEY NOT NULL,
                    marker_id TEXT NOT NULL,
                    uri TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
                )
            `);

            setIsLoading(false);
        } catch (err: any) {
            setError(err as Error);
            console.error("Ошибка при инициализации базы данных:", err.message);
            Alert.alert("Ошибка", "Не удалось инициализировать базу данных: " + err.message);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initializeDatabase();
    }, [initializeDatabase]);

    // --- Database operations ---

    const addMarker = useCallback(async (latitude: number, longitude: number): Promise<string | null> => {
        if (!db) {
            throw new Error('База данных не инициализирована');
        }
        const id = Date.now().toString();

        try {
            await db.runAsync('INSERT INTO markers (id, latitude, longitude) VALUES (?, ?, ?)', [id, latitude, longitude]);
            console.log(`Маркер с ID ${id} успешно добавлен`);
            return id;
        } catch (error: any) {
            console.error('Ошибка при добавлении маркера:', error.message);
            Alert.alert("Ошибка", "Не удалось добавить маркер: " + error.message);
            throw error;
        }
    }, [db]);

    const deleteMarker = useCallback(async (id: string): Promise<void> => {
        if (!db) {
            throw new Error('База данных не инициализирована');
        }

        try {
            await db.runAsync('DELETE FROM markers WHERE id = ?', [id]);
            console.log(`Маркер с ID ${id} успешно удален`);
        } catch (error: any) {
            console.error('Ошибка при удалении маркера:', error.message);
            Alert.alert("Ошибка", "Не удалось удалить маркер: " + error.message);
            throw error;
        }
    }, [db]);

    const getMarkers = useCallback(async (): Promise<MarkerData[]> => {
        if (!db) {
            throw new Error('База данных не инициализирована');
        }

        try {
            const result = await db.getAllAsync('SELECT * FROM markers');

            const markers: MarkerData[] = result.map((row: any) => ({
                id: row.id,
                coordinate: { latitude: row.latitude, longitude: row.longitude },
                title: row.title || '',
                description: row.description || '',
                images: [],
            }));

            console.log(`Успешно получены маркеры`);
            return markers;

        } catch (error: any) {
            console.error('Ошибка при получении маркеров:', error.message);
            Alert.alert("Ошибка", "Не удалось получить маркеры: " + error.message);
            throw error;
        }
    }, [db]);

    const addImage = useCallback(async (markerId: string, uri: string): Promise<void> => {
        if (!db) {
            throw new Error('База данных не инициализирована');
        }
        const id = Date.now().toString();

        try {
            await db.runAsync('INSERT INTO marker_images (id, marker_id, uri) VALUES (?, ?, ?)', [id, markerId, uri]);
            console.log(`Изображение с ID ${id} успешно добавлено к маркеру ${markerId}`);
        } catch (error: any) {
            console.error('Ошибка при добавлении изображения:', error.message);
            Alert.alert("Ошибка", "Не удалось добавить изображение: " + error.message);
            throw error;
        }
    }, [db]);

    const deleteImage = useCallback(async (id: string): Promise<void> => {
        if (!db) {
            throw new Error('База данных не инициализирована');
        }

        try {
            await db.runAsync('DELETE FROM marker_images WHERE id = ?', [id]);
            console.log(`Изображение с ID ${id} успешно удалено`);
        } catch (error: any) {
            console.error('Ошибка при удалении изображения:', error.message);
            Alert.alert("Ошибка", "Не удалось удалить изображение: " + error.message);
            throw error;
        }
    }, [db]);

    const getMarkerImages = useCallback(async (markerId: string): Promise<ImageData[]> => {
        if (!db) {
            throw new Error('База данных не инициализирована');
        }

        try {
            const result = await db.getAllAsync('SELECT * FROM marker_images WHERE marker_id = ?', [markerId]);

            const images: ImageData[] = result.map((row: any) => ({
                id: row.id,
                uri: row.uri,
            }));

            console.log(`Успешно получены изображения для маркера ${markerId}`);
            return images;

        } catch (error: any) {
            console.error('Ошибка при получении изображений:', error.message);
            Alert.alert("Ошибка", "Не удалось получить изображения: " + error.message);
            throw error;
        }
    }, [db]);

    const updateMarker = useCallback(async (id: string, title: string, description: string): Promise<void> => {
        if (!db) {
            throw new Error('База данных не инициализирована');
        }

        try {
            await db.runAsync('UPDATE markers SET title = ?, description = ? WHERE id = ?', [title, description, id]);
            console.log(`Маркер с ID ${id} успешно обновлен`);
        } catch (error: any) {
            console.error('Ошибка при обновлении маркера:', error.message);
            Alert.alert("Ошибка", "Не удалось обновить маркер: " + error.message);
            throw error;
        }
    }, [db]);

    const contextValue: DatabaseContextType = {
        addMarker,
        deleteMarker,
        getMarkers,
        addImage,
        deleteImage,
        getMarkerImages,
        updateMarker,
        isLoading,
        error,
    };

    return (
        <DatabaseContext.Provider value={contextValue}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = (): DatabaseContextType => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase должен использоваться внутри DatabaseProvider');
    }
    return context;
};
