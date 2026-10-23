'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type LegalModalProps = { onClose: () => void };

/** The complete legal notice and privacy information, now within an in-app dialog. */
export function LegalModal({ onClose }: LegalModalProps) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="overlay legal-overlay" onClick={onClose}>
      <section
        className="dialog legal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog-head legal-dialog-head">
          <h2 id="legal-dialog-title">Informationen & Impressum</h2>
          <button ref={closeButton} type="button" className="icon-btn dialog-close-btn" onClick={onClose} aria-label="Informationen schließen">
            <X />
          </button>
        </div>
        <div className="legal-page">
      <div className="legal-card">
        <h1>GreenwayCash</h1>
        <p>
          <strong>Version 1.1</strong> · Entwickelt von Stefan Rosenkranz
        </p>
        <p>
          GreenwayCash ist eine kostenlose, offlinefähige Rechenhilfe für den
          Getränkeverkauf auf dem Weihnachtsmarkt. Sie berechnet Artikel,
          Becherpfand, erhaltenes Bargeld und Rückgeld.
        </p>
        <p>
          Die Anwendung ist keine elektronische Registrierkasse, führt keine
          Transaktionshistorie und ersetzt keine gesetzlich erforderlichen
          Aufzeichnungen.
        </p>
        <p>
          Quellcode und Lizenz: <a href="https://github.com/mgbsrose/GreenwayCash">
            GreenwayCash auf GitHub (MIT-Lizenz)
          </a>
        </p>
      </div>

      <div className="legal-card">
        <h2>Impressum</h2>
        <p>Angaben zum Anbieter, soweit nach § 5 DDG erforderlich:</p>
        <p>
          <strong>Stefan Rosenkranz</strong>
          <br />
          <span className="legal-note">Grüner Weg 31</span>
          <br />
          <span className="legal-note">34431 Marsberg</span>
          <br />
          <span className="legal-note">stefan.rosenkranz@gmx.de</span>
        </p>
      </div>

      <div className="legal-card">
        <h2>Datenschutzhinweise</h2>
        <p>Verantwortlich für die Datenverarbeitung ist der im Impressum genannte Anbieter.</p>
        <h2>Hosting und Serverprotokolle</h2>
        <p>
          Die Website wird bei der dogado GmbH gehostet. Beim Aufruf werden
          technische Zugriffsdaten wie die aufgerufene URL, Datum und Uhrzeit,
          IP-Adresse, Datenmenge, Referrer, Browser und Betriebssystem verarbeitet.
          Dies dient der Sicherheit, Verfügbarkeit und Fehlerbehebung des Webangebots
          sowie technischen Zugriffsauswertungen.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO: unser berechtigtes
          Interesse an einem sicheren und zuverlässigen Betrieb.
        </p>
        <p>
          Laut dogado werden bei den beschriebenen Webhosting-Tarifen IP-Adressen
          in Serverlogs nach 24 Stunden durch Nullsetzen des letzten Oktetts
          anonymisiert und die Logdateien spätestens nach sieben Tagen gelöscht.
          Die Aufbewahrungsfrist aggregierter AWStats-Auswertungen ist nicht bekannt.
          Weitere Informationen:
          {' '}<a href="https://help.dogado.de/hc/de/articles/18708256799249-DSGVO-und-Ihre-Webseite-Homepage-Was-Sie-beachten-sollten">
            dogado: Webhosting und Datenschutz
          </a>.
        </p>
        <h2>Lokale Datenverarbeitung</h2>
        <p>
          GreenwayCash berechnet Artikel, Pfand und Rückgeld lokal im Browser.
          Die aktuelle Rechnung und die erfassten Geldbeträge werden im
          Browserspeicher (localStorage) abgelegt. Zusätzlich kann gespeichert
          werden, dass der Installationshinweis bereits geschlossen wurde.
          Diese Daten werden nicht an einen Anwendungsserver übertragen.
          Es gibt keine eigene Transaktionsdatenbank, keine eingebundene
          Webanalyse und keine Werbe-Cookies.
        </p>
        <p>
          Die lokalen Daten lassen sich über die Browser-Einstellungen löschen.
        </p>
        <h2>Betroffenenrechte</h2>
        <p>
          Nach Maßgabe der DSGVO bestehen insbesondere Rechte auf Auskunft,
          Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch gegen Verarbeitungen auf Grundlage
          berechtigter Interessen. Außerdem besteht ein Beschwerderecht bei
          einer Datenschutzaufsichtsbehörde. Anfragen können an die
          Kontaktadresse im Impressum gerichtet werden.
        </p>
        <p>
          Ergänzende Informationen finden sich in der
          {' '}<a href="https://www.dogado.de/legal/datenschutz">
            Datenschutzerklärung von dogado
          </a>.
        </p>
      </div>
        </div>
      </section>
    </div>
  );
}
