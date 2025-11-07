import { useLocalStorage } from './useLocalStorage';
import { AppData, Exercise, Routine, PracticeLog } from '../types';

const STORAGE_KEY = 'guitar-practice-data';

const initialData: AppData = {
  exercises: [],
  routines: [],
  logs: [],
};

export function useAppData() {
  const [data, setData] = useLocalStorage<AppData>(STORAGE_KEY, initialData);

  const addExercise = (name: string, description: string = '') => {
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name,
      description,
    };
    setData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const updateExercise = (id: string, name: string, description: string) => {
    setData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === id ? { ...ex, name, description } : ex
      ),
    }));
  };

  const deleteExercise = (id: string) => {
    setData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== id),
      routines: prev.routines.map((routine) => ({
        ...routine,
        exercises: routine.exercises.filter((re) => re.exerciseId !== id),
      })),
    }));
  };

  const addRoutine = (name: string) => {
    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      name,
      exercises: [],
    };
    setData((prev) => ({
      ...prev,
      routines: [...prev.routines, newRoutine],
    }));
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    setData((prev) => ({
      ...prev,
      routines: prev.routines.map((routine) =>
        routine.id === id ? { ...routine, ...updates } : routine
      ),
    }));
  };

  const deleteRoutine = (id: string) => {
    setData((prev) => ({
      ...prev,
      routines: prev.routines.filter((routine) => routine.id !== id),
    }));
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
          // Ensure logs array exists (for backward compatibility with old backups)
          setData({
            ...importedData,
            logs: importedData.logs || [],
          });
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
    setData((prev) => ({
      ...prev,
      logs: [...prev.logs, newLog],
    }));
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
  };
}
