import { PracticeLog } from '../types';

interface LogsListProps {
  logs: PracticeLog[];
}

export function LogsList({ logs }: LogsListProps) {
  // Filter logs to only show last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentLogs = logs
    .filter((log) => new Date(log.completedAt) >= sevenDaysAgo)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (recentLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No practice logs yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Complete a routine to see it logged here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Showing {recentLogs.length} completed {recentLogs.length === 1 ? 'session' : 'sessions'} from the past 7 days
      </div>

      {recentLogs.map((log) => (
        <div
          key={log.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {log.routineName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(log.completedAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {log.totalDurationMinutes} min
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {log.exercises.length} {log.exercises.length === 1 ? 'exercise' : 'exercises'}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <details className="cursor-pointer">
                <summary className="hover:text-gray-800 dark:hover:text-gray-200">
                  View exercises
                </summary>
                <ul className="mt-2 ml-4 space-y-1">
                  {log.exercises.map((ex, index) => (
                    <li key={`${ex.exerciseId}-${index}`} className="text-sm">
                      <span className="font-medium">{ex.name}</span>
                      <span className="text-gray-500 dark:text-gray-400"> - {ex.durationMinutes} min</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
