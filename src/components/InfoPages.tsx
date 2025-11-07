import { useState } from 'react';

interface InfoPagesProps {
  onClose: () => void;
}

type Page = 'about' | 'getting-started' | 'features' | 'tips';

export function InfoPages({ onClose }: InfoPagesProps) {
  const [currentPage, setCurrentPage] = useState<Page>('about');

  const pages = [
    { id: 'about' as Page, title: 'About', icon: '📱' },
    { id: 'getting-started' as Page, title: 'Getting Started', icon: '🚀' },
    { id: 'features' as Page, title: 'Features', icon: '✨' },
    { id: 'tips' as Page, title: 'Tips & Tricks', icon: '💡' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Help & Info</h2>
        <button
          onClick={onClose}
          className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setCurrentPage(page.id)}
            className={`p-3 rounded-lg font-medium transition ${
              currentPage === page.id
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">{page.icon}</div>
            <div className="text-sm">{page.title}</div>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-h-[70vh] overflow-y-auto">
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'getting-started' && <GettingStartedPage />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'tips' && <TipsPage />}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About Guitar Practice</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Guitar Practice is a simple, intuitive app designed to help you organize and track your guitar practice sessions.
        Whether you're a beginner or an experienced player, staying consistent with practice is key to improvement.
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        This app helps you:
      </p>
      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
        <li>Create a library of exercises you want to practice</li>
        <li>Build custom practice routines with timed exercises</li>
        <li>Stay focused during practice with built-in timers</li>
        <li>Track your progress as you complete exercises</li>
        <li>Keep your data safe with backup/restore functionality</li>
      </ul>
      <p className="text-gray-600 dark:text-gray-300">
        All your data is stored locally in your browser, ensuring privacy and offline access.
      </p>
    </div>
  );
}

function GettingStartedPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Getting Started</h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Step 1: Create Exercises</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Go to the <strong>Exercises</strong> tab and click "+ Add Exercise". Give each exercise a name (e.g., "C Major Scale", "Alternate Picking")
            and optionally add a description with notes or reminders.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Step 2: Build a Routine</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Go to the <strong>Routines</strong> tab and click "+ Add Routine". Name your routine (e.g., "Morning Practice", "Speed Building").
            Then click "Edit" to add exercises from your library and set how long you want to practice each one.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Step 3: Start Practicing</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Go to the <strong>Practice</strong> tab and tap on any routine to start. Use the play button next to each exercise
            to start the timer. You'll get audio and visual notifications when time is up!
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Step 4: Track Progress</h4>
          <p className="text-gray-600 dark:text-gray-300">
            During a session, check off exercises as you complete them. The app shows your progress and remaining time,
            helping you stay on track.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeaturesPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Features</h3>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">🎯 Exercise Library</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Create unlimited exercises with names and descriptions. Edit or delete them anytime.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">📚 Custom Routines</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Build multiple routines for different goals. Add exercises, set durations, and reorder them as needed.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">⏱️ Practice Timer</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Countdown timers for each exercise. Auto-complete when time runs out, or manually check off exercises.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">🔔 Smart Notifications</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Audio chimes (3x repeat) and large visual banner when exercise time is up - impossible to miss!
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">🌙 Dark Mode</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Easy on the eyes during late-night practice. Toggle with the sun/moon icon.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">💾 Backup & Restore</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Export your data as JSON. Import it back to restore or transfer between devices.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">📱 Mobile Optimized</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Large touch targets, responsive design, works great on phones and tablets.
          </p>
        </div>
      </div>
    </div>
  );
}

function TipsPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tips & Tricks</h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">💡 Structuring Your Practice</h4>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
            <li>Start with warm-up exercises (5-10 min)</li>
            <li>Focus on technique drills (15-20 min)</li>
            <li>Practice songs or creative playing (20-30 min)</li>
            <li>End with something fun you already know</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">⏰ Time Management</h4>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
            <li>Short sessions (5-10 min per exercise) help maintain focus</li>
            <li>Longer sessions (15-20 min) are good for complex techniques</li>
            <li>Create different routines for different time constraints</li>
            <li>Even 15-20 minutes daily is better than one long session per week</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">🎸 Using the Timer Effectively</h4>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
            <li>You can start exercises in any order - flexibility is key</li>
            <li>Manually check off exercises if you want to skip or finish early</li>
            <li>Use the pause button if you need to tune or take a break</li>
            <li>The notification stays for 5 seconds so you can finish your phrase</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">📊 Staying Consistent</h4>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
            <li>Create a "Quick Practice" routine for busy days (15-20 min total)</li>
            <li>Have different routines for different skill focuses</li>
            <li>Update your routines as you improve and add new challenges</li>
            <li>Practice at the same time each day to build a habit</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">💾 Backup Your Data</h4>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
            <li>Click the backup icon (top-right) to export your data regularly</li>
            <li>Keep backups in cloud storage or email them to yourself</li>
            <li>Use import to restore data or move between devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
