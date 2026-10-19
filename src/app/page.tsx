'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  HelpCircle,
  ReceiptText,
  RotateCcw,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import config from '@/config/register.json';
import { ProductTile } from '@/components/ProductTile';
import { LongPress } from '@/components/LongPress';
import { calculate, euro, type Counts, type Item } from '@/lib/calculator';

const items = config.buttons as Item[];
const storageKey = 'rosi-v1';

type LayoutName =
  | 'tabletLandscape'
  | 'tabletPortrait'
  | 'mobileLandscape'
  | 'mobilePortrait';

type Snapshot = { counts: Counts; money: Counts };

function deviceLayout(width: number, height: number): LayoutName {
  if (width < 700) {
    return width > height ? 'mobileLandscape' : 'mobilePortrait';
  }
  return width > height ? 'tabletLandscape' : 'tabletPortrait';
}

export default function Home() {
  // Only the current transaction is persisted; there is no sales history.
  const [counts, setCounts] = useState<Counts>({});
  const [money, setMoney] = useState<Counts>({});
  const [open, setOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [undo, setUndo] = useState<Snapshot | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState({ w: 1024, h: 768 });
  const [online, setOnline] = useState(true);
  const [cashOpen, setCashOpen] = useState(true);
  const [awake, setAwake] = useState(false);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setCounts(saved.counts || {});
      setMoney(saved.money || {});
    } catch {
      // Ignore invalid local state and start with an empty transaction.
    }
    setLoaded(true);

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

  // Clear is protected by a long press; one snapshot can be restored.
  const clear = () => {
    setUndo({ counts, money });
    setCounts({});
    setMoney({});
    setOpen(false);
  };

  const restore = () => {
    if (!undo) return;
    setCounts(undo.counts);
    setMoney(undo.money);
    setUndo(null);
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

  return (
    <main className="app">
      <header>
        <div className="brand">
          <img className="brand-icon" src="/icons/market-stall.svg" alt="" />
          <div>
            <strong>ROSI Cash</strong>
          </div>
        </div>
        <div className="header-actions">
          <span className="connection">{online ? '● Online' : '○ Offline'}</span>
          <button className="icon-btn" onClick={() => setHelp(true)} aria-label="Hilfe">
            <HelpCircle />
          </button>
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
          </div>


        </section>

        <div className={`checkout ${mobile ? (open ? 'receipt-open' : 'receipt-hidden') : ''}`}>
          <aside className="receipt" aria-label="Bon">
            <div className="receipt-head">
              <h2>Bon</h2>
              {mobile && (
                <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Bon schließen">
                  <X />
                </button>
              )}
            </div>

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
          </aside>

          <aside className="payment-card" aria-label="Bezahlung und Rückgeld">
            {calc.totalCents >= 0 ? (
              <>
                <div className="cash-head">
                  <h3>Gegeben & Rückgeld</h3>
                  <button className="link-btn" onClick={() => setCashOpen(!cashOpen)} aria-label={cashOpen ? "Geldtasten einklappen" : "Geldtasten aufklappen"} aria-expanded={cashOpen}>
                    <ChevronDown size={22} className={cashOpen ? 'chevron-open' : 'chevron-closed'} />
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
          <aside className="action-card" aria-label="Vorgang zurücksetzen">          <div className="actions">
            <LongPress
              className="clear-btn"
              onHold={clear}
              delay={config.clearPressMs}
              title="Zum Löschen 1,2 Sekunden gedrückt halten"
            >
              <Trash2 size={19} />
              Clear
            </LongPress>
            {undo && (
              <button className="undo-btn" onClick={restore}>
                <Undo2 size={18} />
                Rückgängig
              </button>
            )}
          </div>
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

      {help && (
        <div className="overlay" onClick={() => setHelp(false)}>
          <section className="dialog" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-head">
              <h2>So funktioniert ROSI Cash</h2>
              <button className="icon-btn" onClick={() => setHelp(false)}>
                <X />
              </button>
            </div>
            <p><b>Getränke:</b> Kurz tippen = +1, lange halten = −1.</p>
            <p><b>Pfand:</b> Bei entsprechend konfigurierten Getränken automatisch; Rückgaben separat erfassen.</p>
            <p><b>Bon:</b> Positionen, Pfand und Gesamtsumme auf einen Blick.</p>
            <p><b>Gegeben:</b> Münzen und Scheine antippen; langer Druck zieht den Betrag ab. „Passend“ setzt die exakte Summe.</p>
            <p><b>Clear:</b> 1,2 Sekunden halten, um alles zurückzusetzen. Danach ist Rückgängig möglich.</p>
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
