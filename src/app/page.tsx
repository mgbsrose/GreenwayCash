'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  HelpCircle,
  Menu,
  Info,
  ReceiptText,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import defaultConfig from '@/config/default.json';
import { ProductTile } from '@/components/ProductTile';
import { ConfigPicker } from '@/components/ConfigPicker';
import { InstallPrompt } from '@/components/InstallPrompt';
import { LongPress } from '@/components/LongPress';
import { calculate, euro, type Counts, type Item } from '@/lib/calculator';

type RegisterConfig = typeof defaultConfig;
const defaultTenant = 'default';
const resolveTenant = () => {
  const segment = window.location.pathname.split('/').filter(Boolean)[0] || defaultTenant;
  return /^[a-z0-9_-]+$/.test(segment) ? segment : defaultTenant;
};
const storageFor = (tenant: string) => tenant === defaultTenant ? 'rosi-v1' : `rosi-v1:${tenant}`;


/** Minimal runtime validation for configurations provided as static JSON. */
function isRegisterConfig(value: unknown): value is RegisterConfig {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<RegisterConfig>;
  return typeof data.customer === 'string' && data.customer.length > 0 &&
    typeof data.depositCents === 'number' && Number.isInteger(data.depositCents) &&
    typeof data.longPressMs === 'number' && typeof data.clearPressMs === 'number' &&
    Array.isArray(data.denominationsCents) && Array.isArray(data.buttons) &&
    data.buttons.every((b) => b && typeof b.id === 'string' &&
      typeof b.title === 'string' && typeof b.priceCents === 'number' &&
      Number.isInteger(b.priceCents) && typeof b.deposit === 'boolean' &&
      typeof b.color === 'string' && typeof b.icon === 'string' &&
      b.layout && typeof b.layout === 'object');
}

type LayoutName =
  | 'tabletLandscape'
  | 'tabletPortrait'
  | 'mobileLandscape'
  | 'mobilePortrait';

/** Select the grid configuration from viewport width and orientation. */
function deviceLayout(width: number, height: number): LayoutName {
  if (width < 700) {
    return width > height ? 'mobileLandscape' : 'mobilePortrait';
  }
  return width > height ? 'tabletLandscape' : 'tabletPortrait';
}

export default function Home() {
  // Each URL selects its own configuration and isolated current transaction.
  const [config, setConfig] = useState<RegisterConfig>(defaultConfig);
  const [tenant, setTenant] = useState(defaultTenant);
  const items = config.buttons as Item[];
  const storageKey = storageFor(tenant);
  // Only the current transaction is persisted; there is no sales history.
  const [counts, setCounts] = useState<Counts>({});
  const [money, setMoney] = useState<Counts>({});
  const [open, setOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState({ w: 1024, h: 768 });
  const [online, setOnline] = useState(true);
  const [cashOpen, setCashOpen] = useState(true);
  const [receiptExpanded, setReceiptExpanded] = useState(false);
  const [awake, setAwake] = useState(false);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);

  useEffect(() => {
    // The browser picks a JSON file by path. Missing/invalid configs fall back
    // to default.json; the path itself is never used as an arbitrary fetch URL.
    let active = true;
    const loadConfig = async () => {
      const requested = resolveTenant();
      let selected = defaultConfig;
      let selectedTenant = defaultTenant;
      if (requested !== defaultTenant) {
        try {
          const response = await fetch(`/config/${requested}.json`);
          if (response.ok) {
            const parsed: unknown = await response.json();
            if (isRegisterConfig(parsed)) {
              selected = parsed;
              selectedTenant = requested;
            }
          }
        } catch {
          // Missing offline cache or network error: use default.
        }
      }
      if (!active) return;
      setConfig(selected);
      setTenant(selectedTenant);
      try {
        const saved = JSON.parse(localStorage.getItem(storageFor(selectedTenant)) || '{}');
        setCounts(saved.counts || {});
        setMoney(saved.money || {});
      } catch {
        setCounts({});
        setMoney({});
      }
      setLoaded(true);
    };
    void loadConfig();

    const resize = () => setSize({ w: innerWidth, h: innerHeight });
    const updateOnline = () => setOnline(navigator.onLine);

    resize();
    updateOnline();
    addEventListener('resize', resize);
    addEventListener('online', updateOnline);
    addEventListener('offline', updateOnline);

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    return () => {
      active = false;
      removeEventListener('resize', resize);
      removeEventListener('online', updateOnline);
      removeEventListener('offline', updateOnline);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(storageKey, JSON.stringify({ counts, money }));
    }
  }, [counts, money, loaded]);

  // Monetary values are always calculated in integer cents.
  const calc = useMemo(
    () => calculate(items, counts, config.depositCents),
    [counts],
  );
  const given = Object.entries(money).reduce(
    (sum, [denomination, quantity]) => sum + Number(denomination) * quantity,
    0,
  );
  const layout = deviceLayout(size.w, size.h);
  const mobile = size.w < 700;
  const productLines = calc.lines.filter((line) => line.type === 'product');

  // A long press decrements but never allows negative item quantities.
  const adjust = (id: string, delta: number) => {
    setCounts((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + delta),
    }));
  };

  const adjustMoney = (denomination: number, delta: number) => {
    setMoney((current) => ({
      ...current,
      [denomination]: Math.max(0, (current[denomination] || 0) + delta),
    }));
  };

  // Clear permanently resets the current transaction after a long press.
  const clear = () => {
    setCounts({});
    setMoney({});
    setOpen(false);
  };

  const toggleWake = async () => {
    if (awake) {
      await wake.current?.release();
      wake.current = null;
      setAwake(false);
      return;
    }

    try {
      const nav = navigator as Navigator & {
        wakeLock?: {
          request: (type: 'screen') => Promise<{ release: () => Promise<void> }>;
        };
      };
      if (nav.wakeLock) {
        wake.current = await nav.wakeLock.request('screen');
        setAwake(true);
      }
    } catch {
      setAwake(false);
    }
  };

  // Render default data immediately; never block the entire UI on hydration or fetch.
  // Persistence stays disabled until the selected tenant has been restored.

  return (
    <main className="app">
      <header>
        <div className="brand">
          <img className="brand-icon" src="/app-icons/market-stall.svg" alt="" />
          <div>
            <strong>GreenwayCash</strong>
            <small className="customer-name">{config.customer}</small>
          </div>
        </div>
        <div className="header-actions desktop-header-actions">
          <span className="connection">{online ? '● Online' : '○ Offline'}</span>
          <ConfigPicker activeTenant={tenant} />
          <a className="icon-btn header-icon-btn" href="/impressum/" aria-label="Informationen und Impressum" title="Informationen und Impressum">
            <Info />
          </a>
          <button className="icon-btn header-icon-btn" onClick={() => setHelp(true)} aria-label="Hilfe">
            <HelpCircle />
          </button>
        </div>
        <div className="mobile-header-menu">
          <button
            type="button"
            className="icon-btn header-icon-btn"
            aria-label="Menü öffnen"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-header-dropdown"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          {mobileMenuOpen && (
            <div id="mobile-header-dropdown" className="mobile-header-dropdown">
              <div className="mobile-menu-status">{online ? '● Online' : '○ Offline'}</div>
              <ConfigPicker activeTenant={tenant} compact />
              <a href="/impressum/" className="mobile-menu-action">
                <Info size={20} /><span>Informationen</span>
              </a>
              <button type="button" className="mobile-menu-action" onClick={() => { setMobileMenuOpen(false); setHelp(true); }}>
                <HelpCircle size={20} /><span>Hilfe</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="workspace">
        <section className="products" aria-label="Produkte">
          <div className="product-grid">
            {items.map((item) => (
              <ProductTile
                key={item.id}
                item={item}
                count={counts[item.id] || 0}
                layout={layout}
                longPressMs={config.longPressMs}
                onChange={adjust}
              />
            ))}
            <LongPress
              className="product-tile reset-tile"
              style={{ gridColumn: layout === 'mobilePortrait' ? '9 / span 4' : '9 / span 4', gridRow: '13 / span 2' }}
              onHold={clear}
              delay={config.clearPressMs}
              title="Zum Löschen 1,2 Sekunden halten"
            >
              <Trash2 size={27} />
              <span className="product-name">Clear</span>
            </LongPress>
          </div>
        </section>

        <div className={`checkout ${mobile ? (open ? 'receipt-open' : 'receipt-hidden') : ''}`}>
          <aside className="receipt" aria-label="Bon">
            <div className="receipt-head">
              <h2>Bon</h2>
              <div className="receipt-head-actions">
                <button
                  className="link-btn"
                  type="button"
                  onClick={() => setReceiptExpanded((current) => !current)}
                  aria-label={receiptExpanded ? 'Bon einklappen' : 'Bon aufklappen'}
                  aria-expanded={receiptExpanded}
                >
                  <ChevronDown
                    size={30}
                    className={receiptExpanded ? 'chevron-open' : 'chevron-closed'}
                  />
                </button>
                {mobile && (
                  <button
                    className="receipt-close"
                    onClick={() => setOpen(false)}
                    aria-label="Bon schließen"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {receiptExpanded ? (
              <>
                <div className="receipt-lines">
                  <div className="line heading">
                    <span>POSITION</span>
                    <span>BETRAG</span>
                  </div>
                  {productLines.map((line) => (
                    <div className="line" key={line.id}>
                      <span>{line.quantity} × {line.title}</span>
                      <span>{euro(line.lineCents)}</span>
                    </div>
                  ))}
                  {productLines.length === 0 && (
                    <p className="empty">Noch keine Getränke ausgewählt</p>
                  )}
                </div>
                <div className="receipt-totals">
                  <div className="line">
                    <span>Warenwert</span>
                    <span>{euro(calc.goodsCents)}</span>
                  </div>
                  <div className="line">
                    <span>Pfand ({calc.depositQuantity} × {euro(config.depositCents)})</span>
                    <span>{euro(calc.depositTotalCents)}</span>
                  </div>
                  <div className="line">
                    <span>Pfand zurück</span>
                    <span>{euro(calc.returnsCents)}</span>
                  </div>
                  <div className="line grand">
                    <strong>{calc.totalCents < 0 ? 'Auszuzahlen' : 'Zu zahlen'}</strong>
                    <strong>{euro(Math.abs(calc.totalCents))}</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="line grand receipt-summary">
                <strong>{calc.totalCents < 0 ? 'Auszuzahlen' : 'Zu zahlen'}</strong>
                <strong>{euro(Math.abs(calc.totalCents))}</strong>
              </div>
            )}
          </aside>

          <aside className="payment-card" aria-label="Bezahlung und Rückgeld">
            {calc.totalCents >= 0 ? (
              <>
                <div className="cash-head">
                  <h3>Gegeben & Rückgeld</h3>
                  <button className="link-btn" onClick={() => setCashOpen(!cashOpen)} aria-label={cashOpen ? "Geldtasten einklappen" : "Geldtasten aufklappen"} aria-expanded={cashOpen}>
                    <ChevronDown size={30} className={cashOpen ? 'chevron-open' : 'chevron-closed'} />
                  </button>
                </div>

                {cashOpen && (
                  <>
                    <div className="cash-grid">
                      {config.denominationsCents.map((denomination) => (
                        <LongPress
                          key={denomination}
                          className="cash-key"
                          onTap={() => adjustMoney(denomination, 1)}
                          onHold={() => adjustMoney(denomination, -1)}
                          title="Tippen: addieren · Halten: abziehen"
                        >
                          {denomination < 100
                            ? `${denomination} ct`
                            : `${denomination / 100} €`}
                          {money[denomination] > 0 && (
                            <span className="cash-count">{money[denomination]}×</span>
                          )}
                        </LongPress>
                      ))}
                    </div>
                    <div className="cash-actions">
                      <button
                        onClick={() => setMoney({ [calc.totalCents]: 1 })}
                        disabled={calc.totalCents === 0}
                      >
                        <Check size={16} />
                        Passend
                      </button>
                      <button onClick={() => setMoney({})}>
                        <RotateCcw size={16} />
                        Zurücksetzen
                      </button>
                    </div>
                  </>
                )}

                <div className="line paid">
                  <span>Gegeben</span>
                  <strong>{euro(given)}</strong>
                </div>
                <div className="change">
                  <span>{given >= calc.totalCents ? 'Rückgeld' : 'Noch offen'}</span>
                  <strong>{euro(Math.abs(given - calc.totalCents))}</strong>
                </div>
              </>
            ) : (
              <div className="change">
                <span>An Kunden auszahlen</span>
                <strong>{euro(-calc.totalCents)}</strong>
              </div>
            )}
          </aside>

        </div>
      </div>

      {mobile && open && (
        <button className="receipt-backdrop" type="button" aria-label="Bon schließen" onClick={() => setOpen(false)} />
      )}

      {mobile && (
        <div className="mobile-footer">
          <div>
            <small>{calc.totalCents < 0 ? 'AUSZAHLEN' : 'ZU ZAHLEN'}</small>
            <strong>{euro(Math.abs(calc.totalCents))}</strong>
          </div>
          <button onClick={() => setOpen((current) => !current)}>
            <ReceiptText size={19} />
            {open ? 'Bon schließen' : 'Bon anzeigen'}
          </button>
        </div>
      )}

      <InstallPrompt />

      {help && (
        <div className="overlay" onClick={() => setHelp(false)}>
          <section className="dialog" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-head">
              <h2>So funktioniert GreenwayCash</h2>
              <button className="icon-btn" onClick={() => setHelp(false)}>
                <X />
              </button>
            </div>
            <p><b>Getränke:</b> Kurz tippen = +1, lange halten = −1.</p>
            <p><b>Pfand:</b> Bei entsprechend konfigurierten Getränken automatisch; Rückgaben separat erfassen.</p>
            <p><b>Bon:</b> Positionen, Pfand und Gesamtsumme auf einen Blick.</p>
            <p><b>Gegeben:</b> Münzen und Scheine antippen; langer Druck zieht den Betrag ab. „Passend“ setzt die exakte Summe.</p>
            <p><b>Clear:</b> 1,2 Sekunden halten, um alles zurückzusetzen. Der Vorgang kann nicht rückgängig gemacht werden.</p>
            <p><b>Offline:</b> Nach dem ersten vollständigen Laden und Installieren auch ohne Internet nutzbar.</p>
            <button className="wake" onClick={toggleWake}>
              {awake ? 'Display-Wachhalten beenden' : 'Display wach halten (falls unterstützt)'}
            </button>
            <button className="close" onClick={() => setHelp(false)}>
              Verstanden
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
