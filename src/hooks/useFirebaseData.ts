import { useState, useEffect } from 'react';
import {
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { AppData, Exercise, Routine, PracticeLog } from '../types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'guitar-practice-data';

const initialData: AppData = {
  exercises: [],
  routines: [],
  logs: [],
};

export function useFirebaseData() {
  const { user } = useAuth();
  const [localData, setLocalData] = useLocalStorage<AppData>(STORAGE_KEY, initialData);
  const [data, setData] = useState<AppData>(localData);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync data with Firestore when user is authenticated
  useEffect(() => {
    if (!user) return;

    const userDataRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(
      userDataRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const firestoreData = docSnap.data() as AppData;
          setData(firestoreData);
          setLocalData(firestoreData); // Keep local backup
        } else {
          // First time user - upload local data to Firestore
          setDoc(userDataRef, localData);
        }
      },
      (error) => {
        console.error('Error syncing data:', error);
        // Fall back to local data on error
        setData(localData);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Helper to update data (both local and Firestore)
  const updateData = async (newData: AppData) => {
    setData(newData);
    setLocalData(newData); // Always update local storage

    if (user && isOnline) {
      try {
        const userDataRef = doc(db, 'users', user.uid);
        await setDoc(userDataRef, newData);
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    }
  };

  const addExercise = (name: string, description: string = '') => {
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name,
      description,
    };
    const newData = {
      ...data,
      exercises: [...data.exercises, newExercise],
    };
    updateData(newData);
  };

  const updateExercise = (id: string, name: string, description: string) => {
    const newData = {
      ...data,
      exercises: data.exercises.map((ex) =>
        ex.id === id ? { ...ex, name, description } : ex
      ),
    };
    updateData(newData);
  };

  const deleteExercise = (id: string) => {
    const newData = {
      ...data,
      exercises: data.exercises.filter((ex) => ex.id !== id),
      routines: data.routines.map((routine) => ({
        ...routine,
        exercises: routine.exercises.filter((re) => re.exerciseId !== id),
      })),
    };
    updateData(newData);
  };

  const addRoutine = (name: string) => {
    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      name,
      exercises: [],
    };
    const newData = {
      ...data,
      routines: [...data.routines, newRoutine],
    };
    updateData(newData);
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    const newData = {
      ...data,
      routines: data.routines.map((routine) =>
        routine.id === id ? { ...routine, ...updates } : routine
      ),
    };
    updateData(newData);
  };

  const deleteRoutine = (id: string) => {
    const newData = {
      ...data,
      routines: data.routines.filter((routine) => routine.id !== id),
    };
    updateData(newData);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guitar-practice-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData.exercises && importedData.routines) {
          const validData = {
            ...importedData,
            logs: importedData.logs || [],
          };
          updateData(validData);
        } else {
          alert('Invalid backup file format');
        }
      } catch (error) {
        alert('Error reading backup file');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const addLog = (log: Omit<PracticeLog, 'id'>) => {
    const newLog: PracticeLog = {
      ...log,
      id: crypto.randomUUID(),
    };
    const newData = {
      ...data,
      logs: [...data.logs, newLog],
    };
    updateData(newData);
  };

  return {
    data,
    addExercise,
    updateExercise,
    deleteExercise,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    exportData,
    importData,
    addLog,
    isOnline,
  };
}
