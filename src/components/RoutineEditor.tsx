import { useState } from 'react';
import { Routine, Exercise, RoutineExercise } from '../types';

interface RoutineEditorProps {
  routine: Routine;
  exercises: Exercise[];
  onUpdate: (id: string, updates: Partial<Routine>) => void;
  onClose: () => void;
  onStartSession: (routine: Routine) => void;
}

export function RoutineEditor({ routine, exercises, onUpdate, onClose, onStartSession }: RoutineEditorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>(routine.exercises);

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addExercise = (exerciseId: string) => {
    if (routineExercises.some((re) => re.exerciseId === exerciseId)) return;
    const updated = [...routineExercises, { exerciseId, durationMinutes: 5 }];
    setRoutineExercises(updated);
  };

  const updateDuration = (exerciseId: string, durationMinutes: number) => {
    const updated = routineExercises.map((re) =>
      re.exerciseId === exerciseId ? { ...re, durationMinutes } : re
    );
    setRoutineExercises(updated);
  };

  const removeExercise = (exerciseId: string) => {
    setRoutineExercises(routineExercises.filter((re) => re.exerciseId !== exerciseId));
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= routineExercises.length) return;

    const updated = [...routineExercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setRoutineExercises(updated);
  };

  const handleSave = () => {
    onUpdate(routine.id, { exercises: routineExercises });
    onClose();
  };

  const getExerciseName = (exerciseId: string) => {
    return exercises.find((ex) => ex.id === exerciseId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit: {routine.name}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onStartSession(routine)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Start Session
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save & Close
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="font-semibold mb-2 dark:text-white">Add Exercise</h3>
        <input
          type="text"
          placeholder="Search or browse exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700">
          {exercises.length === 0 ? (
            <p className="p-3 text-gray-500 dark:text-gray-400 text-sm">No exercises available. Create some exercises first!</p>
          ) : filteredExercises.length === 0 ? (
            <p className="p-3 text-gray-500 dark:text-gray-400 text-sm">No exercises match "{searchTerm}"</p>
          ) : (
            filteredExercises.map((exercise) => {
              const alreadyAdded = routineExercises.some((re) => re.exerciseId === exercise.id);
              return (
                <button
                  key={exercise.id}
                  onClick={() => addExercise(exercise.id)}
                  disabled={alreadyAdded}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-900 dark:text-white ${
                    alreadyAdded ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''
                  }`}
                >
                  <div className="font-medium">
                    {exercise.name}
                    {alreadyAdded && <span className="text-green-600 dark:text-green-400 ml-2 text-sm">✓ Added</span>}
                  </div>
                  {exercise.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">{exercise.description}</div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold dark:text-white">Routine Exercises ({routineExercises.length})</h3>
        {routineExercises.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No exercises in this routine yet</p>
        ) : (
          routineExercises.map((re, index) => (
            <div key={re.exerciseId} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveExercise(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveExercise(index, 'down')}
                    disabled={index === routineExercises.length - 1}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1">
                  <div className="font-medium dark:text-white">{getExerciseName(re.exerciseId)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={re.durationMinutes}
                    onChange={(e) => updateDuration(re.exerciseId, parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">min</span>
                </div>
                <button
                  onClick={() => removeExercise(re.exerciseId)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
