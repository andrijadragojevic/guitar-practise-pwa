export interface Exercise {
  id: string;
  name: string;
  description: string;
}

export interface RoutineExercise {
  exerciseId: string;
  durationMinutes: number;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
}

export interface SessionExercise {
  exerciseId: string;
  name: string;
  durationMinutes: number;
  completed: boolean;
  isTimerRunning: boolean;
  remainingSeconds: number;
}

export interface PracticeLog {
  id: string;
  routineId: string;
  routineName: string;
  completedAt: string; // ISO date string
  exercises: {
    exerciseId: string;
    name: string;
    durationMinutes: number;
  }[];
  totalDurationMinutes: number;
}

export interface SessionState {
  routineId: string;
  routineName: string;
  date: string; // ISO date string for the day
  exercises: SessionExercise[];
}

export interface AppData {
  exercises: Exercise[];
  routines: Routine[];
  logs: PracticeLog[];
}
