'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, SlidersHorizontal, X } from 'lucide-react';

type ConfigEntry = { id: string; customer: string };

function validEntries(value: unknown): value is ConfigEntry[] {
  return Array.isArray(value) && value.every((entry) =>
    entry && typeof entry.id === 'string' &&
    /^[a-z0-9_-]+$/.test(entry.id) &&
    typeof entry.customer === 'string' && entry.customer.trim().length > 0,
  );
}

/** Simple navigation modal: all available configurations come from the build manifest. */
export function ConfigPicker({ activeTenant, compact = false }: { activeTenant: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ConfigEntry[] | null>(null);
  const [error, setError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();

    const load = async () => {
      setError(false);
      setEntries(null);
      try {
        const response = await fetch('/config/index.json', { signal: controller.signal });
        if (!response.ok) throw new Error('Konfigurationsliste nicht verfügbar');
        const data: unknown = await response.json();
        if (!validEntries(data)) throw new Error('Ungültige Konfigurationsliste');
        if (!controller.signal.aborted) setEntries(data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    };
    void load();

    return () => {
      controller.abort();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={compact ? "mobile-menu-action" : "icon-btn header-icon-btn"}
        onClick={() => setOpen(true)}
        aria-label="Preislisten"
        title="Preislisten"
        aria-haspopup="dialog"
      >
        <SlidersHorizontal size={compact ? 20 : 24} />
        {compact && <span>Preislisten</span>}
      </button>

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <section
            className="dialog config-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="config-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dialog-head">
              <h2 id="config-dialog-title">Preislisten</h2>
              <button
                ref={closeRef}
                type="button"
                className="icon-btn dialog-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Auswahl schließen"
              >
                <X />
              </button>
            </div>
            {entries === null && !error && <p>Konfigurationen werden geladen …</p>}
            {error && <p>Die Konfigurationen konnten nicht geladen werden. Bitte die Verbindung prüfen.</p>}
            {entries && (
              <nav className="config-options" aria-label="Verfügbare Preislistenn">
                {entries.map(({ id, customer }) => (
                  <a
                    className={id === activeTenant ? 'config-option is-active' : 'config-option'}
                    href={id === 'default' ? '/' : `/${id}/`}
                    key={id}
                    aria-current={id === activeTenant ? 'page' : undefined}
                  >
                    <span>{customer}</span>
                    {id === activeTenant && <Check size={18} aria-label="Aktuell" />}
                  </a>
                ))}
              </nav>
            )}
          </section>
        </div>
      )}
    </>
  );
}
