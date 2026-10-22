# GreenwayCash

**Version 1.0.0 · Betatest · Stand 19.10.2026.** Der initiale Entwicklungsumfang ist abgeschlossen; Anwender testen die App derzeit. Eine formelle Abnahme ist noch nicht dokumentiert.

**App:** https://cash.introsinet.de/ · **Quellcode:** https://github.com/mgbsrose/GreenwayCash · **Lizenz:** MIT (Copyright © 2026 Stefan Rosenkranz).

GreenwayCash ist eine responsive und offlinefähige **Rechenhilfe für Getränkeverkäufe, Becherpfand und Rückgeld** am Weihnachtsmarkt. Sie ist **keine fiskalische Registrierkasse**: keine TSE, keine Umsatz- oder Transaktionshistorie, keine Datenbank, keine Benutzerkonten und keine Synchronisierung. Etwaige gesetzliche Aufzeichnungspflichten müssen anderweitig erfüllt werden.

## Funktionen
- Getränk antippen **+1**, etwa **600 ms halten −1**, Mengen nie unter null.
- Automatisch **2 € Pfand** für Glühwein, Apfelpunsch, Kakao, Superbecher und Kaffee.
- Pfandrückgaben auch ohne Neukauf; reine Auszahlungen möglich.
- **Bon beim Start eingeklappt**, Gesamtsumme sichtbar; **Gegeben & Rückgeld beim Start ausgeklappt**.
- Bargeldtasten, „Passend“, „Zurücksetzen“, Rückgeld und offener Betrag.
- **Clear** als rote Kachel, **1,2 Sekunden halten**, löscht aktuelle Rechnung und erfasste Geldbeträge **ohne Undo**.
- Responsive Produktkacheln und mobiler Summen-Footer mit Bon-Overlay.
- **(?)** Hilfe; **(i)** App-Informationen, Impressum und Datenschutz.
- Browserabhängiger PWA-Installationshinweis, Offline-Unterstützung und lokale Speicherung der laufenden Rechnung.

## Dokumentation

| Datei | Inhalt |
| --- | --- |
| [docs/BEDIENUNG.md](docs/BEDIENUNG.md) | Kurzanleitung für Testnutzer, Installation und Testfälle |
| [docs/KONFIGURATION.md](docs/KONFIGURATION.md) | Produkte, Preise, Pfand und Kachel-Layout |
| [docs/TECHNIK.md](docs/TECHNIK.md) | Architektur, Speicherlogik, PWA, Einschränkungen, Abnahme |
| **[eidolon-help.md](eidolon-help.md)** | **Git pull, Entwicklung, Build und Deployment ohne rsync/root** |
| **[agents.md](agents.md)** | **Dauerhafte Übergabe für spätere KI-unterstützte Entwicklung ohne diesen Chat** |
| [AGENTS.md](AGENTS.md) | Einstieg für Coding Agents |

## Architektur und Veröffentlichung

Next.js 16, React 19, TypeScript und Lucide. Next.js wird mittels `output: 'export'` und `trailingSlash: true` **statisch** gebaut: Ergebnis in `out/`. Auf dogado/Plesk ist kein Node.js-Prozess nötig; die App wird am HTTPS-Domain-Root `/` betrieben.

**Git-Branches:** `main` enthält den Quellcode samt Dokumentation; `deploy` ausschließlich die fertigen statischen Dateien. Plesk zieht den Branch `deploy` für `cash.introsinet.de`. Ein Git-Push auf `main` allein ist **kein Deployment**.

```bash
cd /workspaces/local/GreenwayCash
git pull --ff-only origin main
npm run typecheck
npm run build
```

Der Container `eidolon` hat **keine Root-Rechte und kein rsync**. Der nachweislich funktionierende Deployment-Weg verwendet einen separaten Worktree sowie `find`/`cp -a`. **Vollständige, sicherheitskommentierte Befehle:** [eidolon-help.md](eidolon-help.md).

Das GitHub-Repo ist öffentlich: Forks und Pull Requests sind möglich, Außenstehende können den Originalbranch aber nicht ohne Berechtigungen direkt überschreiben. **Keine Zugangsdaten ins Repo einchecken.**

## Bekannte Prüfpunkte vor Freigabe
- Ergebnisse des laufenden Nutzer-Betatests auswerten und Zielgeräte/Offline-Verhalten abnehmen.
- Native Installationsaufforderung ist **browserabhängig**; das PWA-Manifest enthält gegenwärtig SVG-Icons, ggf. PNG 192×192/512×512 ergänzen.
- Service-Worker-Offline-Caching nach Aufruf der Impressumsroute und nach App-Updates auf echten Geräten testen.
- Icons liegen absichtlich unter **`/app-icons/`**, nicht `/icons/` (Hosting-Konflikt).
- [Impressum und Datenschutz](https://cash.introsinet.de/impressum/) sind hinterlegt; abschließende Rechtsprüfung und tatsächliche Tarif-/AWStats-Speicherfristen sind nicht vollständig bestätigt.

**Wiederaufnahme:** Zuerst [agents.md](agents.md) und [eidolon-help.md](eidolon-help.md) lesen. Keine Funktionsänderungen allein aufgrund des Dokumentationsabschlusses.

## Version 1.1 – URL-basierte Konfiguration (erster Schritt)

Ohne Settings-Dialog wählt jetzt das **erste URL-Pfadsegment** die JSON-Konfiguration: `/` lädt `src/config/default.json`, `/spmz2026` lädt `src/config/spmz2026.json`, `/stmagnus_getraenke2026` bzw. `/stmagnus_speisen2026` die gleichnamigen Dateien. Für unbekannte Namen wird `default.json` verwendet. Der Inhalt von `customer` steht in der Kopfzeile.

**Neue Konfigurationen:** `src/config/<name>.json` ablegen, `customer` setzen, `npm run build` ausführen. Das Build-Script `scripts/sync-config.mjs` veröffentlicht automatisch alle Konfigurationen unter `out/config/`. **Keine Route im Quellcode registrieren.** `public/.htaccess` sorgt bei Apache/Plesk für die Startseiten-Auslieferung bei unbekannten URL-Pfaden. Für jede bekannte Konfiguration gilt derzeit dieselbe Anfangs-Preisliste als Platzhalter; insbesondere die Schützenvereins-Speisenpreise sind noch nicht fachlich gepflegt. Die aktuellen Getränkefarben wurden übernommen.

Rechnungen sind pro Mandantenroute lokal getrennt; `/` behält den bisherigen Speicher `rosi-v1`. Der Settings-Dialog gehört zu einer späteren Umsetzung von [Issue #1](https://github.com/mgbsrose/GreenwayCash/issues/1).
**Entwicklungsserver (Next.js):** Für alle beim Start vorhandenen JSON-Konfigurationen erzeugt `src/app/[config]/page.tsx` mit `generateStaticParams()` eine echte Seite, z. B. `/spmz2026/`. Die Namen kommen automatisch aus dem Verzeichnis – keine manuell gepflegte Liste. Bei einer neu hinzugefügten JSON-Datei den Dev-Server neu starten. Bei Apache/Plesk fängt `.htaccess` zusätzlich unbekannte URLs ab und liefert die Default-App aus. Die Startseite rendert die Default-Konfiguration sofort und wartet nicht mehr mit einem Vollbild-Ladehinweis auf die Browserinitialisierung.

### Aktualisierte Weihnachtsmarkt-Routen (22.10.2026)

- `/spmz_wm_2026/` – Spielmannszug Weihnachtsmarkt 2026, bisheriges Sortiment mit den aktuellen Farben; „Bier / Radler“ (alkoholfrei) zweizeilig.
- `/stmagnus_wm_getraenke_2026/` – St. Magnus Getränke: fünf Artikel zu je 2,00 €, ohne Pfand.
- `/stmagnus_wm_speisen_2026/` – St. Magnus Speisen: Bratwurst mit Brot 2,50 €, Currywurst mit Brot 2,70 €, Pommes Frites 3,00 €, Mantaplatte 6,00 €, ohne Pfand.

Die vorherigen Routen `/spmz2026/`, `/stmagnus_getraenke2026/`, `/stmagnus_speisen2026/` entfallen und nutzen auf Apache/Plesk künftig den Default-Fallback. Im Next.js-Entwicklungsserver liefern unbekannte Routen weiterhin 404. Die Default-Konfiguration unter `/` wurde nicht geändert.


**Aktueller Stand (22.10.2026):** Die ehemalige `register.json` ist gelöscht. `default.json` wurde 1:1 aus `spmz_wm_2026.json` übernommen, einschließlich des Zeilenumbruchs in „Bier / Radler / Alkoholfrei“ und sämtlicher Farbänderungen.
