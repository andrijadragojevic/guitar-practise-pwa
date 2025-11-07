import { Routine } from '../types';

interface PracticeListProps {
  routines: Routine[];
  onStart: (routine: Routine) => void;
}

export function PracticeList({ routines, onStart }: PracticeListProps) {
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Start Practicing</h2>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No routines yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Create your first routine in the Routines tab!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {routines.map((routine) => (
            <button
              key={routine.id}
              onClick={() => onStart(routine)}
              disabled={routine.exercises.length === 0}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 truncate">
                    {routine.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {routine.exercises.length} exercise{routine.exercises.length !== 1 ? 's' : ''}
                    </span>
                    {routine.exercises.length > 0 && (
                      <>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {getTotalTime(routine)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
