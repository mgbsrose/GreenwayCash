# GreenwayCash – Entwicklungsübergabe für KI-Assistenten

Stand: 19.10.2026. Diese Datei bewahrt den notwendigen Entwicklungsstand **ohne den ursprünglichen Chat**. Bei späteren Abweichungen ist der aktuelle Repository-Code maßgeblich.

## Status, Zweck, Nicht-Ziele
- App **GreenwayCash** (früher ROSI Cash/RosiCash), Repository https://github.com/mgbsrose/GreenwayCash (öffentlich, MIT-Lizenz), Live-URL https://cash.introsinet.de/.
- Version **1.0.0**, Entwicklung zunächst abgeschlossen; Nutzer befinden sich **im Betatest**, keine formelle Abnahme dokumentiert.
- Touch-Rechenhilfe für Getränke, Becherpfand und Rückgeld auf einem Weihnachtsmarkt. **Keine steuerliche Registrierkasse**, keine TSE, keine Transaktions-/Umsatzhistorie, keine Benutzerkonten, keine Datenbank oder zentrale Synchronisierung. Nicht ohne Auftrag erweitern.
- Technologiestack: Next.js 16, React 19, TypeScript, Lucide; statischer Export nach `out/`; Domain-Root und HTTPS erforderlich. Keine Node.js-Laufzeit beim Hoster.

## Git, Hosting und Entwicklungsumgebung
- `main`: Quellcode und Dokumentation. `deploy`: **nur fertiger Inhalt von `out/`** für dogado/Plesk; nach Push ggf. Plesk „Pull Updates“. Kein automatischer Webhook bestätigt.
- Entwicklungscontainer **eidolon**, ohne Root-Rechte, ohne rsync. Quelle: `/workspaces/local/GreenwayCash`; Deploy-Worktree: `/workspaces/local/GreenwayCash-deploy`.
- Bewährter Ablauf: `git pull --ff-only origin main`, `npm run typecheck`, `npm run build`; im **gesonderten Deploy-Worktree** alte Exportdateien außer `.git` entfernen, `cp -a ../GreenwayCash/out/. .`, `git add -A`, commit, `git push origin deploy`. Sicherheitsprüfungen und vollständige Befehle: [eidolon-help.md](eidolon-help.md).
- Dev-Origin in `next.config.ts`: `eidolon3000.greenway.home.arpa`; `output: 'export'`, `trailingSlash: true`.
- Öffentliches Repo: Dritte können lesen, forken und Pull Requests vorschlagen, aber nicht automatisch auf `main`/`deploy` schreiben. Niemals Secrets oder Tokens committen.

## Dateikarte
- `src/config/register.json`: Preise, Pfand, Haltezeiten, Nennwerte, Layoutkoordinaten (12 Spalten × 14 Zeilen).
- `src/lib/calculator.ts`: Berechnung ausschließlich in ganzen Cent.
- `src/app/page.tsx`: UI, Warenkorb, Bon, Geldtasten, Help, Responsive, localStorage.
- `src/components/LongPress.tsx`: Tap/Hold (Pointerbewegung über 14 px bricht Geste ab); `ProductTile.tsx`: Produktkacheln.
- `src/components/InstallPrompt.tsx`: Browser-PWA-Installationshinweis, iOS-Safari-Anleitung.
- `src/app/manifest.ts`, `public/sw.js`, `public/app-icons/`: PWA und Offline.
- `src/app/impressum/page.tsx`: öffentliche Informationen/Impressum/Datenschutz; Betreiber-Kontaktdaten **nur dort**, nicht in dieser Übergabe.
- `src/app/styles.css`: Farben, Header, Responsive-Layout.

## Unbedingt erhaltene Fachregeln und UI-Entscheidungen
- Preise: Glühwein 3,00 €, Apfelpunsch 2,50 €, Schuss 0,50 €, Kakao 2,00 €, Superbecher 3,00 €, Sahne 0,50 €, Bier 2,00 €, alkoholfreies Bier 2,00 €, Schnaps 1,50 €, Kaffee 1,50 €, Softdrinks 1,00 €, Wasser 1,00 €, Pfand zurück −2,00 €.
- **Exakt fünf Produkte** mit automatischem Pfand **2,00 €**: Glühwein, Apfelpunsch, Kakao, Superbecher, Kaffee. Pfandrückgabe auch ohne Kauf (Auszahlung).
- Artikel antippen +1, 600ms halten −1, nie unter null. **Clear** als separate rote Kachel: 1200ms halten, endgültig löschen, **kein Undo**.
- **Bon anfangs eingeklappt**, **Gegeben & Rückgeld anfangs ausgeklappt**, unabhängig aufklappbar. Smartphone: fixer Summen-Footer + Bon-Overlay; Tablet: rechte Seitenleiste.
- 4 Reihen à 3 Produkte bei breiten Ansichten, darunter Pfand zurück (2/3 Breite) und Clear (1/3). Smartphone-Hochformat zwei Produktspalten.
- Farben: Biere gelb, Kaffee dunkler braun, Kakao/Superbecher gleiches hellbraun, Sahne cremefarben. Artikelnamen 16px, Smartphone 14px.
- Header-Buttons (i) und (?) identische 40×40px Klickfläche mit 24×24px SVG, zentriert.
- Geldtasten 10ct–100€, „Passend“, „Zurücksetzen“, Rückgeld/offener Betrag.
- Laufende Rechnung in `localStorage['rosi-v1']` als `{counts,money}`. **Diesen historischen Schlüssel nicht ohne Migration ändern.** Installationshinweis unter `greenwaycash-install-dismissed-v1`.

## Bekannte Einschränkungen / offene Themen
1. **Betatest läuft**, noch keine dokumentierte abschließende Geräte-/Offline-/Rechtsabnahme.
2. Manifest enthält nur SVG-PWA-Icon. Für zuverlässigere Installation eventuell PNG 192×192/512×512 und Apple-Touch-Icon ergänzen; Browser entscheidet über Installierbarkeit.
3. Service Worker cached navigierte Antworten derzeit unter dem Cache-Key `/`, auch für andere Routen; kann den Offline-Fallback verfälschen. Bei Überarbeitung URL-spezifisches Cacheverhalten testen und Cacheversion ändern.
4. Auf dogado zeigt `/icons/` offenbar Hosting-/Apache-Symbole: **immer `/app-icons/`** verwenden.
5. Rechtliche Hinweise in `src/app/impressum/page.tsx` sind nicht abschließend juristisch geprüft. dogado nennt für Webhosting IP-Anonymisierung nach 24h und Log-Löschung spätestens nach 7 Tagen; tarifbezogene Gültigkeit und AWStats-Aufbewahrung unbestätigt.
6. Kein dokumentierter automatisierter Testlauf/CI; frühe Builds liefen auf eidolon laut Nutzer erfolgreich. Neue Builds und echte Geräteprüfungen nicht ohne Nachweis als erfolgt ausgeben.

## Wiederaufnahme nach Chat-Löschung
1. `README.md`, diese Datei, `docs/TECHNIK.md`, `docs/KONFIGURATION.md` und `eidolon-help.md` lesen.
2. Beide Git-Branches und Live-Deployment prüfen; Betatest-Befunde erheben und priorisieren.
3. Kleine, gezielte Änderungen auf `main`, in Deutsch dokumentieren; Integer-Cent-Logik und Produktregeln bewahren.
4. `npm run typecheck`, `npm run build`, reale Geräte und Offline testen.
5. Nur bei tatsächlich geänderten Webdateien den Build auf `deploy` veröffentlichen; Plesk aktualisieren und Live-URL prüfen.
6. Diese Übergabe bei Architektur-, Fach- oder Deploymentänderungen fortschreiben.

## Stand der Mandantenfähigkeit (22.10.2026; Issue #1)

Erster Umsetzungsschritt: **ohne Settings-Dialog**, URL-basiert. `/` lädt `src/config/default.json`; `/<name>` lädt zur Laufzeit `/config/<name>.json`, wenn vorhanden, ansonsten die Default-Konfiguration. `customer` wird in der Kopfzeile angezeigt. Es gibt **keine feste Mandanten-Routenliste**. Das Script `scripts/sync-config.mjs` publiziert die Dateien bei `npm run dev/build` automatisch unter `public/config` (im Export `out/config`); `public/.htaccess` regelt den Apache-Fallback für unbekannte Single-Segment-URLs. Die frühere `src/config/register.json` bleibt als historische Kopie bestehen, ist aber nicht mehr die aktive Quelle. Die aktuellen Farbwerte wurden bei der Aufteilung beibehalten.

Aktive JSON-Namen: `default`, `spmz2026`, `stmagnus_getraenke2026`, `stmagnus_speisen2026`. Die beiden St.-Magnus-Konfigurationen sind **nur initiale Kopien**, nicht fachlich gepflegte Speisen-/Getränkeangebote. Der lokale Warenkorb ist nach der **aufgelösten** Konfiguration isoliert; `default` nutzt weiterhin `rosi-v1`. Es ist noch **kein Settings-Dialog** umgesetzt. Vor Deployment unbedingt `out/.htaccess`, dynamischen Fallback, PWA/Offline und aktuelle Betatestergebnisse testen. Weitere Arbeit an Issue #1.

**Wichtige Korrektur 22.10.2026:** Der alleinige Client-Router lieferte unter Next.js dev auf `/spmz2026/` 404; eine `.htaccess` hilft nicht auf dem Next.js-Entwicklungsserver. Deshalb generiert `src/app/[config]/page.tsx` über `generateStaticParams()` automatisch Routen für vorhandene JSON-Dateien. Die Client-Auswahl liest weiterhin flexibel die passende Konfiguration, neue JSON erfordern keine Codeänderung, aber einen neuen Build (bzw. Neustart des Dev-Servers). Unbekannte Pfade fallen nur auf Apache/Plesk via `.htaccess` auf die Default-App zurück. Die blockierende 'Konfiguration wird geladen'-Oberfläche wurde entfernt; stattdessen sofort Default-UI. Port-3001-Entwicklungsorigin ergänzt.

### Neuester Mandantenstand vom 22.10.2026

Die gültigen URL-Segmente lauten nun `spmz_wm_2026`, `stmagnus_wm_getraenke_2026`, `stmagnus_wm_speisen_2026` und `default`. Alte drei Namen wurden aus `src/config/` entfernt. **Spielmannszug** nutzt weiterhin das bestehende Sortiment/Farben und hat für das alkoholfreie Bier den zweizeiligen Titel „Bier / Radler“ / „Alkoholfrei“. **St. Magnus Getränke** hat fünf 2-€-Produkte (Westheimer Pilsener 0,2 l, Westheimer Alkoholfrei 0,33 l, Westheimer Radler 0,33 l, Cola/Fanta 0,33 l, Wasser 0,33 l), **St. Magnus Speisen** vier Produkte (Bratwurst mit Brot 2,50 €, Currywurst mit Brot 2,70 €, Pommes 3,00 €, Mantaplatte 6,00 €). Beide St.-Magnus-Mandanten: **kein Pfand, keine Pfandrückgabe**, Clear bleibt. Neue Artikelsymbole für Speisen in `ProductTile.tsx`. JSON-Titel dürfen Textumbrüche `\\n` enthalten, die CSS mit `white-space:pre-line` darstellt. `default.json` bleibt unverändert. Mandantenspezifische Datenspeicherung nutzt die neuen Routennamen; keine Migration der alten Test-Warenkörbe.


**Update (22.10.2026):** `src/config/register.json` wurde endgültig entfernt. `src/config/default.json` wurde als 1:1-Kopie von `src/config/spmz_wm_2026.json` angelegt (einschließlich `customer`, Farben und Textumbrüchen). Der automatische Konfigurations-Sync lässt `register.json` vorsorglich weiterhin aus, falls eine Datei mit diesem Namen wieder auftaucht; es gibt keine aktive Abhängigkeit davon.
