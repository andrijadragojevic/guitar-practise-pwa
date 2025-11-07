import { useState, useEffect } from 'react';
import { Routine, Exercise, SessionExercise, SessionState } from '../types';

interface PracticeSessionProps {
  routine: Routine;
  exercises: Exercise[];
  onEnd: () => void;
  onLogComplete: (log: {
    routineId: string;
    routineName: string;
    exercises: { exerciseId: string; name: string; durationMinutes: number }[];
    totalDurationMinutes: number;
  }) => void;
}

const SESSION_STATE_KEY = 'practice-session-state';

export function PracticeSession({ routine, exercises, onEnd, onLogComplete }: PracticeSessionProps) {
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>(() => {
    // Try to load saved session state
    try {
      const saved = localStorage.getItem(SESSION_STATE_KEY);
      if (saved) {
        const savedState: SessionState = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];

        // Only restore if it's the same routine and same day
        if (savedState.routineId === routine.id && savedState.date === today) {
          return savedState.exercises;
        }
      }
    } catch (error) {
      console.error('Error loading session state:', error);
    }

    // Initialize fresh session
    return routine.exercises.map((re) => {
      const exercise = exercises.find((ex) => ex.id === re.exerciseId);
      return {
        exerciseId: re.exerciseId,
        name: exercise?.name || 'Unknown',
        durationMinutes: re.durationMinutes,
        completed: false,
        isTimerRunning: false,
        remainingSeconds: re.durationMinutes * 60,
      };
    });
  });
  const [flashNotification, setFlashNotification] = useState<string | null>(null);

  const playCompletionSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Three quick beeps - beepbeepbeep
      for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // High pitch beep
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + (i * 0.25); // 0.25s between beeps
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15); // Each beep is 0.15 seconds
      }
    } catch (error) {
      console.log('Audio playback not supported', error);
    }
  };

  // Save session state to localStorage when exercises change
  useEffect(() => {
    const sessionState: SessionState = {
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString().split('T')[0],
      exercises: sessionExercises,
    };
    localStorage.setItem(SESSION_STATE_KEY, JSON.stringify(sessionState));
  }, [sessionExercises, routine.id, routine.name]);

  // Check if all exercises are completed and log it
  useEffect(() => {
    const allCompleted = sessionExercises.length > 0 && sessionExercises.every((ex) => ex.completed);

    if (allCompleted) {
      // Check if we already logged this session
      const logKey = `logged-${routine.id}-${new Date().toISOString().split('T')[0]}`;
      if (!sessionStorage.getItem(logKey)) {
        const totalDuration = sessionExercises.reduce((sum, ex) => sum + ex.durationMinutes, 0);
        onLogComplete({
          routineId: routine.id,
          routineName: routine.name,
          exercises: sessionExercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            name: ex.name,
            durationMinutes: ex.durationMinutes,
          })),
          totalDurationMinutes: totalDuration,
        });
        // Mark as logged for this session
        sessionStorage.setItem(logKey, 'true');
      }
    }
  }, [sessionExercises, routine.id, routine.name, onLogComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionExercises((prev) =>
        prev.map((ex) => {
          if (!ex.isTimerRunning || ex.remainingSeconds <= 0) return ex;

          const newRemaining = ex.remainingSeconds - 1;
          if (newRemaining === 0) {
            playCompletionSound();
            setFlashNotification(ex.name);
            setTimeout(() => setFlashNotification(null), 1000); // Show for 1 second
            return { ...ex, remainingSeconds: 0, isTimerRunning: false, completed: true };
          }
          return { ...ex, remainingSeconds: newRemaining };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTimer = (exerciseId: string) => {
    setSessionExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId === exerciseId) {
          return { ...ex, isTimerRunning: !ex.isTimerRunning };
        }
        // Stop all other timers
        return { ...ex, isTimerRunning: false };
      })
    );
  };

  const toggleComplete = (exerciseId: string) => {
    setSessionExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId === exerciseId) {
          const newCompleted = !ex.completed;
          // When unchecking (marking as incomplete), reset the timer
          if (!newCompleted) {
            return {
              ...ex,
              completed: false,
              isTimerRunning: false,
              remainingSeconds: ex.durationMinutes * 60
            };
          }
          // When checking (marking as complete), just stop the timer
          return { ...ex, completed: true, isTimerRunning: false };
        }
        return ex;
      })
    );
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress for this routine?')) {
      setSessionExercises(routine.exercises.map((re) => {
        const exercise = exercises.find((ex) => ex.id === re.exerciseId);
        return {
          exerciseId: re.exerciseId,
          name: exercise?.name || 'Unknown',
          durationMinutes: re.durationMinutes,
          completed: false,
          isTimerRunning: false,
          remainingSeconds: re.durationMinutes * 60,
        };
      }));
      localStorage.removeItem(SESSION_STATE_KEY);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = sessionExercises.filter((ex) => ex.completed).length;
  const progress = (completedCount / sessionExercises.length) * 100;
  const totalRemainingSeconds = sessionExercises
    .filter((ex) => !ex.completed)
    .reduce((sum, ex) => sum + ex.remainingSeconds, 0);

  return (
    <div className="space-y-4">
      {flashNotification && (
        <div className="fixed inset-0 z-50 bg-green-500 dark:bg-green-600 opacity-30 pointer-events-none transition-opacity" />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{routine.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {completedCount} of {sessionExercises.length} completed
          </p>
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">
            Total time remaining: {formatTime(totalRemainingSeconds)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetProgress}
            className="bg-orange-600 dark:bg-orange-700 text-white px-4 py-2 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition"
          >
            Reset
          </button>
          <button
            onClick={onEnd}
            className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            End Session
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-green-600 dark:bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {sessionExercises.map((ex) => (
          <div
            key={ex.exerciseId}
            className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition ${
              ex.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={ex.completed}
                onChange={() => toggleComplete(ex.exerciseId)}
                className="w-6 h-6 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className={`font-medium text-lg ${ex.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-white'}`}>
                  {ex.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Duration: {ex.durationMinutes} min
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold tabular-nums ${
                  ex.remainingSeconds < 60 && ex.isTimerRunning ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'
                }`}>
                  {formatTime(ex.remainingSeconds)}
                </div>
                <button
                  onClick={() => toggleTimer(ex.exerciseId)}
                  disabled={ex.remainingSeconds === 0 || ex.completed}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    ex.isTimerRunning
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
                  }`}
                >
                  {ex.isTimerRunning ? 'Pause' : (ex.remainingSeconds === 0 || ex.completed) ? 'Done' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
