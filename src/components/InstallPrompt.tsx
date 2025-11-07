import { useEffect, useState } from 'react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Detect Android
    const android = /Android/.test(navigator.userAgent);

    setIsIOS(iOS);
    setIsAndroid(android);

    // Show prompt if NOT in standalone mode and on mobile
    if (!isStandalone && (iOS || android)) {
      setShowPrompt(true);
    }
  }, []);

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-lg mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📱</span>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Install as App</h3>
            {isIOS && (
              <p className="text-sm">
                Tap the <strong>Share button</strong> (□↑) at the bottom, then tap <strong>"Add to Home Screen"</strong>
              </p>
            )}
            {isAndroid && (
              <p className="text-sm">
                Tap the <strong>menu (⋮)</strong> then tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>
              </p>
            )}
            <p className="text-xs mt-2 opacity-90">
              After installing, <strong>close this browser</strong> and tap the app icon on your home screen for fullscreen mode!
            </p>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-white opacity-75 hover:opacity-100 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
