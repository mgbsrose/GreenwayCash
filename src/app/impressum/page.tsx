import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Informationen & Impressum | GreenwayCash',
  description: 'Informationen, Anbieterkennzeichnung und Datenschutzhinweise zu GreenwayCash',
};

/**
 * Statically generated legal information page.
 * Replace the visibly marked placeholders with verified owner contact details
 * before considering the public legal notice complete.
 */
export default function ImprintPage() {
  return (
    <main className="legal-page">
      <a href="/">← Zurück zu GreenwayCash</a>
      <div className="legal-card">
        <h1>GreenwayCash</h1>
        <p>
          <strong>Version 1.0</strong> · Entwickelt von Stefan Rosenkranz
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
        <h2>Hinweise zum Datenschutz</h2>
        <p>
          Die Berechnung erfolgt auf deinem Gerät. Artikelmengen und erfasste
          Bargeldbeträge werden für die aktuelle Rechnung im lokalen
          Browserspeicher (localStorage) gespeichert. Zusätzlich kann ein
          geschlossener Installationshinweis lokal vermerkt werden.
          GreenwayCash verwendet keinen eigenen Login, keine eigene
          Transaktionsdatenbank und keine eingebundene Webanalyse.
        </p>
        <p>
          Beim Abruf der Website können beim Hosting-Anbieter technische
          Verbindungsdaten einschließlich IP-Adressen in Server-Logs verarbeitet
          werden. Verantwortlichkeit, Speicherdauer und weitere Angaben zum
          Hosting müssen vor Veröffentlichung in einer vollständigen
          Datenschutzerklärung geklärt werden.
        </p>
      </div>
    </main>
  );
}
