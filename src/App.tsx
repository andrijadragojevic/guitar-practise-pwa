import { useState, useEffect } from 'react';
import { useFirebaseData } from './hooks/useFirebaseData';
import { useDarkMode } from './hooks/useDarkMode';
import { useAuth } from './contexts/AuthContext';
import { ExerciseList } from './components/ExerciseList';
import { RoutineList } from './components/RoutineList';
import { PracticeList } from './components/PracticeList';
import { RoutineEditor } from './components/RoutineEditor';
import { PracticeSession } from './components/PracticeSession';
import { DataManagement } from './components/DataManagement';
import { InfoPages } from './components/InfoPages';
import { LogsList } from './components/LogsList';
import { Modal } from './components/Modal';
import { InstallPrompt } from './components/InstallPrompt';
import { AuthModal } from './components/AuthModal';
import { Routine } from './types';

type View = 'practice' | 'exercises' | 'routines' | 'routine-editor' | 'session' | 'info' | 'logs';

function App() {
  const { user, loading, isAnonymous } = useAuth();
  const {
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
  } = useFirebaseData();

  const { isDark, toggleDarkMode } = useDarkMode();
  const [view, setView] = useState<View>('practice');
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  // Show auth modal on first load if not signed in
  useEffect(() => {
    if (!loading && !user) {
      setIsAuthModalOpen(true);
    }
  }, [loading, user]);

  // Reset profile image error when user changes
  useEffect(() => {
    setProfileImageError(false);
  }, [user?.photoURL]);

  const handleSelectRoutine = (routine: Routine) => {
    setSelectedRoutine(routine);
    setView('routine-editor');
  };

  const handleStartSession = (routine: Routine) => {
    setSelectedRoutine(routine);
    setView('session');
  };

  const handleCloseEditor = () => {
    setSelectedRoutine(null);
    setView('routines');
  };

  const handleEndSession = () => {
    setSelectedRoutine(null);
    setView('practice');
  };

  const handleLogComplete = (log: {
    routineId: string;
    routineName: string;
    exercises: { exerciseId: string; name: string; durationMinutes: number }[];
    totalDurationMinutes: number;
  }) => {
    addLog({
      ...log,
      completedAt: new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <InstallPrompt />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Guitar Practice
              {!isOnline && (
                <span className="ml-3 text-sm font-normal text-orange-600 dark:text-orange-400">
                  (Offline)
                </span>
              )}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition relative"
              title={isAnonymous ? 'Anonymous Account' : user?.displayName || 'Account'}
            >
              {user?.photoURL && !profileImageError ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="h-6 w-6 rounded-full object-cover"
                  onError={() => setProfileImageError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
              {!isAnonymous && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              )}
            </button>
            <button
              onClick={() => setView('info')}
              className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition"
              title="Help & Info"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              onClick={toggleDarkMode}
              className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition"
              title="Backup & Restore"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </button>
          </div>
        </header>

        {view !== 'session' && view !== 'routine-editor' && view !== 'info' && (
          <nav className="flex gap-2 mb-6">
            <button
              onClick={() => setView('practice')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === 'practice'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => setView('routines')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === 'routines'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Routines
            </button>
            <button
              onClick={() => setView('exercises')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === 'exercises'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setView('logs')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === 'logs'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Logs
            </button>
          </nav>
        )}

        <main>
          {view === 'practice' && (
            <PracticeList
              routines={data.routines}
              onStart={handleStartSession}
            />
          )}

          {view === 'exercises' && (
            <ExerciseList
              exercises={data.exercises}
              onAdd={addExercise}
              onUpdate={updateExercise}
              onDelete={deleteExercise}
            />
          )}

          {view === 'routines' && (
            <RoutineList
              routines={data.routines}
              onAdd={addRoutine}
              onDelete={deleteRoutine}
              onSelect={handleSelectRoutine}
              onStart={handleStartSession}
            />
          )}

          {view === 'routine-editor' && selectedRoutine && (
            <RoutineEditor
              routine={selectedRoutine}
              exercises={data.exercises}
              onUpdate={updateRoutine}
              onClose={handleCloseEditor}
              onStartSession={handleStartSession}
            />
          )}

          {view === 'session' && selectedRoutine && (
            <PracticeSession
              routine={selectedRoutine}
              exercises={data.exercises}
              onEnd={handleEndSession}
              onLogComplete={handleLogComplete}
            />
          )}

          {view === 'logs' && (
            <LogsList logs={data.logs} />
          )}

          {view === 'info' && (
            <InfoPages onClose={() => setView('practice')} />
          )}
        </main>

        <Modal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          title="Backup & Restore"
        >
          <DataManagement onExport={exportData} onImport={importData} />
        </Modal>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
