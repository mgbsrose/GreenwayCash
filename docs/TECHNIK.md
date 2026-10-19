# GreenwayCash – Technik, Architektur und Betrieb

**Stand:** 19.10.2026 · **Version:** 1.0.0 · **Phase:** Betatest, Entwicklung zunächst abgeschlossen.

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
