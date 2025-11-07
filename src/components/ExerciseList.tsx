import { useState } from 'react';
import { Exercise } from '../types';

interface ExerciseListProps {
  exercises: Exercise[];
  onAdd: (name: string, description: string) => void;
  onUpdate: (id: string, name: string, description: string) => void;
  onDelete: (id: string) => void;
}

export function ExerciseList({ exercises, onAdd, onUpdate, onDelete }: ExerciseListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      onUpdate(editingId, formData.name, formData.description);
      setEditingId(null);
    } else {
      onAdd(formData.name, formData.description);
      setIsAdding(false);
    }
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setFormData({ name: exercise.name, description: exercise.description });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Exercises</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Exercise
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-3">
          <div>
            <input
              type="text"
              placeholder="Exercise name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
          </div>
          <div>
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {exercises.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No exercises yet. Add your first exercise to get started!</p>
        ) : (
          exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{exercise.name}</h3>
                  {exercise.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{exercise.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${exercise.name}"?`)) {
                        onDelete(exercise.id);
                      }
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm"
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
