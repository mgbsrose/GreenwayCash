'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';

/**
 * Browser-specific install event. Chromium exposes this non-standard event
 * only when the PWA meets its installation requirements.
 */
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

const dismissalKey = 'greenwaycash-install-dismissed-v1';

function isInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as NavigatorWithStandalone).standalone === true
  );
}

function isAppleMobile(): boolean {
  const platform = navigator.platform;
  return (
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Shows a small, dismissible installation suggestion:
 * - Chromium: calls the browser's native install prompt on user interaction
 * - iOS/iPadOS Safari: explains Share > Add to Home Screen
 * - Installed or previously dismissed: does not interrupt checkout
 *
 * Browsers without either installation path do not see the suggestion.
 */
export function InstallPrompt() {
  const pendingEvent = useRef<InstallEvent | null>(null);
  const [mode, setMode] = useState<'native' | 'ios' | null>(null);

  useEffect(() => {
    if (isInstalled() || localStorage.getItem(dismissalKey) === '1') return;

    // iOS/iPadOS do not expose beforeinstallprompt. The install flow is manual.
    if (isAppleMobile()) {
      setMode('ios');
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      pendingEvent.current = event as InstallEvent;
      setMode('native');
    };

    const onInstalled = () => {
      pendingEvent.current = null;
      setMode(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(dismissalKey, '1');
    pendingEvent.current = null;
    setMode(null);
  };

  const install = async () => {
    const event = pendingEvent.current;
    if (!event) return;

    pendingEvent.current = null;
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome === 'accepted') {
        setMode(null);
      } else {
        dismiss();
      }
    } catch {
      // The browser may decline to show a prompt; leave checkout usable.
      setMode(null);
    }
  };

  if (!mode) return null;

  return (
    <aside className="install-prompt" aria-label="App installieren">
      <button
        type="button"
        className="install-dismiss"
        onClick={dismiss}
        aria-label="Installationshinweis schließen"
      >
        <X size={18} />
      </button>
      <div className="install-heading">
        <Download size={20} />
        <strong>GreenwayCash installieren</strong>
      </div>
      {mode === 'native' ? (
        <>
          <p>Direkt vom Startbildschirm öffnen – auch offline.</p>
          <button type="button" className="install-action" onClick={install}>
            App installieren
          </button>
        </>
      ) : (
        <>
          <p>
            In Safari <Share2 size={16} aria-hidden="true" className="install-inline-icon" />
            {' '}<strong>Teilen</strong> wählen und anschließend
            {' '}<strong>Zum Home-Bildschirm</strong>.
          </p>
          <button type="button" className="install-action" onClick={dismiss}>
            Verstanden
          </button>
        </>
      )}
    </aside>
  );
}
