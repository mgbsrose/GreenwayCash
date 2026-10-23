# GreenwayCash – Technik, Architektur und Betrieb

**Stand:** 19.10.2026 · **Version:** 1.1.0 · **Phase:** Betatest, Entwicklung zunächst abgeschlossen.

Für Git-/Build-/Deployment-Kommandos siehe [eidolon-help.md](../eidolon-help.md). Für künftige KI-gestützte Entwicklung siehe [agents.md](../agents.md).

## Architektur
- Next.js 16 (App Router), React 19, TypeScript, Lucide.
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`; Dev-Origin `eidolon3000.greenway.home.arpa`.
- Rein statischer Build in `out/`, HTTPS-Hosting bei dogado/Plesk am Domain-Root `/`. **Kein Node.js-Prozess** auf dem Webserver.
- Keine Datenbank, kein Backend, keine Anmeldung, keine Umsatz-/Transaktionshistorie, keine Fiskalisierung/TSE: **Rechenhilfe, keine steuerliche Kasse**.

## Codeübersicht
| Pfad | Funktion |
| --- | --- |
| `src/config/register.json` | Preise, Produkte, Pfand, Nennwerte, Layouts, Haltezeiten |
| `src/lib/calculator.ts` | Cent-basierte Kalkulation |
| `src/app/page.tsx` | Clientzustand, Produktwahl, Bon, Geld, Hilfe, responsive Anzeige, SW-Registrierung |
| `src/components/ProductTile.tsx` | Getränkekacheln |
| `src/components/LongPress.tsx` | Pointer-Tap/Hold, Abbruch bei 14px Bewegung, einmaliges Auslösen |
| `src/components/InstallPrompt.tsx` | Chromium-`beforeinstallprompt`, iOS-Safari-Anleitung |
| `src/app/styles.css` | Farben, Raster, Mobile-Ansichten und Header-Buttons |
| `src/app/manifest.ts` | Statisches PWA-Manifest |
| `src/app/impressum/page.tsx` | Informationen, Betreiberangaben, Datenschutz |
| `public/sw.js` | Cache- und Offline-Strategie |
| `public/app-icons/` | SVG-Icons (Pfad nicht in `/icons/` ändern) |

## Geld und Zustand
Alle Preise/Gesamtwerte als **ganze Cent**. Fünf Produkte haben automatisch 200 Cent Pfand: Glühwein, Apfelpunsch, Kakao, Superbecher, Kaffee. „Pfand zurück“ ist eine negative Position, auch reine Auszahlungen möglich. Produkt-Tap +1, Halten 600ms −1, Clear 1200ms **unwiderruflich**; kein Undo.

Bon anfangs **eingeklappt** (`receiptExpanded=false`), Gegeben & Rückgeld anfangs **ausgeklappt** (`cashOpen=true`). Smartphones verwenden fixen Summenbalken und Bon-Overlay. (i) und (?) identisch ausgerichtet: je 40×40px Klickfläche und 24×24px Icon.

Die laufende Rechnung wird ausschließlich lokal in `localStorage['rosi-v1']` als `{counts,money}` gespeichert. **Schlüssel nicht ohne Migration umbenennen!** Ein weggeklickter Installationshinweis wird als `greenwaycash-install-dismissed-v1` gespeichert. Browserdaten löschen kann die aktuelle Rechnung entfernen.

## PWA und Offline – Einschränkungen
- Service Worker nur im **Production-Build** registriert. Shell/Assets werden gecached; Netzwerk zuerst bei Navigation, Cache zuerst bei Assets. Cache-Name in `public/sw.js` bei relevanten Releases anpassen.
- **Bekannte technische Schwachstelle:** Erfolgreiche Navigationen (auch `/impressum/`) werden derzeit unter Cache-Key `/` abgelegt. Dadurch kann eine andere Seite als Offline-Fallback der Startseite erscheinen. Bei Wiederaufnahme pro URL korrekt cachen, offline gezielt testen.
- Die Installationsaufforderung hängt vom Browser ab; iOS/iPadOS nutzt die manuelle Safari-Installation.
- Aktuell enthält das Manifest **SVG-Icons**, keine dedizierten PNG 192×192 und 512×512. Für verlässliche Browser-Installierbarkeit ggf. ergänzen; echter Geräte-Test erforderlich.
- Ein erfolgreicher Build **belegt weder Offlinefunktion noch Installierbarkeit**. Erst vollständig online laden und dann Flugmodus/offline neu starten und testen.
- Hosterproblem: `/icons/` zeigte Server-/Apache-Symbole. Deshalb bewusst `/app-icons/` verwenden.

## Git, Eidolon, Plesk
- Öffentliches Repository: https://github.com/mgbsrose/GreenwayCash, MIT.
- Branch **`main`**: Quellcode und Dokumentation. Branch **`deploy`**: ausschließlich Dateien des gebauten `out/`-Verzeichnisses. **Dogado/Plesk zieht `deploy`** für https://cash.introsinet.de/.
- Eidolon-Container: `/workspaces/local/GreenwayCash` und Deploy-Worktree `/workspaces/local/GreenwayCash-deploy`; **keine Root-Rechte und kein rsync**.
- Bekannter Ablauf: `git pull --ff-only origin main`, `npm run typecheck`, `npm run build`; im sicheren Deploy-Worktree Dateien außer `.git` mittels `find` entfernen, `cp -a ../GreenwayCash/out/. .`, `git add -A`, commit, `git push origin deploy`. In Plesk gegebenenfalls **Pull Updates**. Ein aktiver automatischer Webhook ist **nicht bestätigt**.
- Exakt kopierbare Befehle und Löschwarnungen: [eidolon-help.md](../eidolon-help.md).

## Impressum und Datenschutz
`src/app/impressum/page.tsx` wird zu `/impressum/` exportiert und über (i) geöffnet. Die Betreiberangaben liegen in dieser Datei; nicht an anderen Stellen duplizieren. Die App selbst überträgt keine Artikel-/Geldbeträge an einen Server. Dogado protokolliert Zugriffe und bietet AWStats an. Laut dogado-Angaben zu Webhosting-Tarifen: IP-Anonymisierung nach 24 Stunden, Log-Löschung spätestens nach sieben Tagen. **Tarifkonkrete Gültigkeit und Speicherdauer aggregierter AWStats sind ungeklärt**; keine juristische Komplettprüfung behaupten.

## Betatest- und Abnahmecheckliste
- [ ] Typecheck und Production-Build der **letzten Codeänderung** erfolgreich
- [ ] Alle Artikel, Centpreise, automatisches Pfand der fünf Getränke, reine Pfandrückgabe
- [ ] Tap/Hold ohne Doppelauslösung; Clear erst nach 1,2 Sekunden, kein Undo
- [ ] Geldtasten, Passend, Zurücksetzen, Rückgeld/noch offen
- [ ] Bon anfangs zu, Geldbereich anfangs offen; beide unabhängig bedienbar
- [ ] Smartphone/Tablet hoch/quer, (i)/(?) ausgerichtet und erreichbar
- [ ] Installationsprompt, realer Offline-Neustart, SW-Update, Impressum
- [ ] HTTPS-Live-URLs `/`, `/impressum/`, `/manifest.webmanifest`, `/sw.js`, `/app-icons/icon.svg`
- [ ] Bei Plesk tatsächlich aktuellen `deploy`-Stand geladen
- [ ] Betatestergebnisse und rechtliche Restpunkte abschließend bewertet

**Verifizierungsstatus:** Nutzer meldete frühere erfolgreiche Next.js-Produktionsbuilds auf eidolon. Bei diesem reinen Dokumentationsabschluss wurde **kein neuer lokaler Build oder Endgeräte-Test** ausgeführt.

## Version 1.1 – Mandantenrouten ohne Next.js-Server

Da `output: 'export'` aktiv ist, kann eine Next.js-Route `app/[config]/page.tsx` **nicht beliebige, beim Build unbekannte Pfade serverseitig auflösen**. Stattdessen enthält die statische Startseite eine Client-Konfigurationsauswahl: `window.location.pathname` wird auf ein einzelnes sicheres Segment reduziert; der Browser lädt `/config/<segment>.json`. Falls es keine passende Datei gibt, die Datei ungültig ist oder das Netzwerk nicht erreichbar ist, greift `default.json`. `/` verwendet direkt die im Bundle enthaltene Default-Konfiguration.

`scripts/sync-config.mjs` kopiert vor jedem `npm run dev`/`npm run build` alle aktiven JSON-Konfigurationen aus `src/config/` in den generierten Ordner `public/config/`, wodurch sie im `out/config/` landen. **Neue Konfiguration = nur zusätzliche JSON + Build/Deployment**, keine Routenliste, kein Settings-Dialog. Apache/Plesk liefert für unbekannte einfache URLs über `public/.htaccess` `/index.html` aus; existierende Dateien und Verzeichnisse gehen vor. Bitte prüfen, dass der statische Export tatsächlich **`out/.htaccess`** enthält und Plesk `mod_rewrite` mit erlaubter `.htaccess`-Verarbeitung unterstützt.

Die Warenkorbdaten bleiben lokal und werden pro tatsächlich geladener Konfiguration getrennt: `rosi-v1` für `default`, `rosi-v1:<name>` für andere. Eine fehlende URL-Konfiguration verwendet den Default-Warenkorb, ohne fremde Beträge zu übernehmen. Service-Worker-Navigationen werden jetzt URL-spezifisch zwischengespeichert; Konfigurationsdateien verwenden Netzwerk-zuerst mit Cache-Fallback. **Offline-Tenantwechsel und unbekannte URL-Fallbacks müssen auf echten Geräten geprüft werden.** Die vier Beispieldateien sind zunächst Kopien des aktuellen Getränkesortiments, keine vollständigen Schützenvereinskonfigurationen. Einstellungen/Mandantenauswahl per Dialog bleiben Teil von Issue #1.

**Korrektur Entwicklungsserver (22.10.2026):** `src/app/[config]/page.tsx` generiert mit `generateStaticParams()` für alle vorhandenen Tenant-JSON-Dateien eigene HTML-Seiten, ohne feste Routenliste. Das vermeidet `404` auf `next dev`/`next start` für bekannte Routen. Bei neuen Dateien Dev-Server neu starten und vor Deployment neu bauen. **Unbekannte Routen** nutzen nur unter Apache mit aktiver `public/.htaccess` den Default-Fallback; der Next.js-Dev-Server kann unter `output: 'export'` keine beliebigen unbekannten Routen serverseitig bereitstellen. Die Default-Oberfläche wird nun sofort gerendert, wodurch der frühere initiale Ladebildschirm nicht dauerhaft hängen bleiben kann. `eidolon3001.greenway.home.arpa` ist in `allowedDevOrigins` ergänzt.

### Konkrete Menüs und Umbenennung (22.10.2026)

Die aktiven Mandanten heißen jetzt `spmz_wm_2026`, `stmagnus_wm_getraenke_2026`, `stmagnus_wm_speisen_2026`; die bisherigen drei JSON-Dateien wurden entfernt. Das dynamische Build-Script `scripts/sync-config.mjs` und `generateStaticParams()` finden die neuen Namen automatisch. St. Magnus erhält ausschließlich die festgelegten fünf Getränke bzw. vier Speisen, jeweils **ohne Pfand und ohne Rückgabe-Kachel**. `default.json` ist unverändert. Die Produktnamen unterstützen gezielte Zeilenumbrüche über Text und `white-space: pre-line`, ohne HTML-Ausführung. Die Artikellayouts von St. Magnus belegen die Rasterzeilen 1–12, Clear bleibt in 13–14.

**Hinweis zur Zustandskompatibilität:** Die lokalen Rechnungen sind anhand des Mandantenschlüssels isoliert. Durch die Umbenennung werden bisherige `rosi-v1:<alter-name>`-Datensätze nicht in die neuen Mandanten übernommen. Dieser Verzicht auf Migration ist bei Wechsel von initialen Beispielkonfigurationen beabsichtigt.


**Bereinigung (22.10.2026):** Die Legacy-Datei `src/config/register.json` wurde gelöscht, `src/config/default.json` aus `spmz_wm_2026.json` neu kopiert. Konfigurationen werden weiterhin automatisch über `scripts/sync-config.mjs` in `out/config/` veröffentlicht.


## Einfaches Modal zur Konfigurationsauswahl (v1.1)

`src/components/ConfigPicker.tsx` öffnet im Header ein reines Navigationsmodal mit den automatisch bei Build/Dev erzeugten Einträgen aus `/config/index.json`. Einträge werden als Links `/<id>/` (`default` → `/`) dargestellt; der aktuelle Stand ist markiert. Das Manifest entsteht in `scripts/sync-config.mjs` aus Dateiname und `customer`, ohne feste Routenliste und ohne Konfigurationsbearbeitung. Die Datei ist ein öffentliches statisches Asset. Der Service Worker cached `/config/index.json` für einen späteren Offline-Aufruf und verwendet für Config-Dateien Netzwerk-zuerst. Bei neuen Mandanten muss neu gebaut werden; die Wechselnavigation und Offline-Verfügbarkeit sind auf Testgeräten zu prüfen.


### Versionsstand 1.1.0 (22.10.2026)

Das Header-Modal zur Konfigurationsauswahl trägt jetzt den Titel **„Preisliste“**, mit ausdrücklich dunkler Schrift vor hellem Dialoghintergrund. `src/config/default.json` trägt im `customer`-Feld den Zusatz `(Default)`, damit der Eintrag vom gleich sortierten Spielmannszug-Mandanten unterschieden werden kann. `package.json`/`package-lock.json` enthalten 1.1.0, die Infoseite zeigt Version 1.1. Vor produktiver Freigabe Typecheck, Build, Konfigurationsindex und Modal auf Zielgeräten prüfen.


### Custom-SVG-Icons (v1.1)

Die vier Speisen-Bratwurst/Currywurst/Pommes/Mantaplatte sowie die Westheimer-Flasche verwenden jetzt die eigenen `currentColor`-SVG-React-Komponenten aus `src/components/CustomProductIcons.tsx`; `ProductTile.tsx` löst sie über die JSON-Eigenschaft `icon` auf. Es werden keine externen Icons geladen. Für die Auslieferung wurde die Service-Worker-Cachekennung angehoben. Darstellung auf dem Zielgerät nach Build/Deployment prüfen.


### Fehlerkorrekturen und UI (23.10.2026)

Ein echtes `src/app/favicon.ico` vermeidet die dynamische `/[config]`-Behandlung der Browser-Anfrage auf `/favicon.ico`, die zuvor im Next.js-Dev-Modus trotz `generateStaticParams` einen 500-Fehler auslösen konnte. Das Favicon stammt aus der Nutzerdatei `munze.png`. Unbekannte URLs bleiben im Entwicklungsserver bei statischem Export ein 404; Apache/Plesk liefert per `.htaccess` die Default-Seite aus.

Unter 700 px werden Online-/Offline-Status, Preisliste, Info und Hilfe in einem Hamburger-Dropdown zusammengefasst. Desktop-Icons bleiben separat; `ConfigPicker` verwendet `SlidersHorizontal`. Die Bratwurst-Form wurde als eigene geschwungene Illustration verbessert, statt ein urheberrechtlich fremdes Vektorwerk zu kopieren. Die bisher doppelte Spielmannszug-Datei `spmz_wm_2026.json` wurde entfernt, `default.json` trägt wieder den Kundennamen ohne `(Default)`. Favicon, Menü und Next-Routing vor Deployment auf eidolon überprüfen.


### Information/Impressum als Modal (23.10.2026)

Die frühere `src/app/impressum/page.tsx` wurde entfernt. Ihr vollständiger Inhalt liegt nun in `src/components/LegalModal.tsx` und wird über `showLegal` in `src/app/page.tsx` als scrollbarer `role=dialog`-Dialog mit X/Escape/Backdrop-Schließen eingeblendet, auf Desktop und Mobil. Die URL ändert sich nicht. Die separate `/impressum/`-Route ist entfallen und wird nicht mehr precached. `ConfigPicker.tsx` verwendet jetzt durchgängig **„Preislisten“**, das Dialog-X hat explizit schwarze Schriftfarbe. Die Legal-Texte wurden unverändert migriert. Funktion, Tastaturbedienung und Textlesbarkeit bei kleinen Displays prüfen.
