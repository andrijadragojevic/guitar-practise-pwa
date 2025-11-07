import { useState } from 'react';
import { Routine } from '../types';

interface RoutineListProps {
  routines: Routine[];
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onSelect: (routine: Routine) => void;
  onStart: (routine: Routine) => void;
}

export function RoutineList({ routines, onAdd, onDelete, onSelect, onStart }: RoutineListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name);
    setName('');
    setIsAdding(false);
  };

  const getTotalTime = (routine: Routine) => {
    const totalMinutes = routine.exercises.reduce((sum, ex) => sum + ex.durationMinutes, 0);
    if (totalMinutes === 0) return '0 min';
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Routines</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Routine
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-3">
          <input
            type="text"
            placeholder="Routine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setName('');
              }}
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {routines.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No routines yet. Create your first routine!</p>
        ) : (
          routines.map((routine) => (
            <div
              key={routine.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{routine.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {routine.exercises.length} exercise{routine.exercises.length !== 1 ? 's' : ''}
                    {routine.exercises.length > 0 && (
                      <span className="text-blue-600 dark:text-blue-400 font-medium ml-2">• {getTotalTime(routine)}</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onStart(routine)}
                    disabled={routine.exercises.length === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => onSelect(routine)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete routine "${routine.name}"?`)) {
                        onDelete(routine.id);
                      }
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
