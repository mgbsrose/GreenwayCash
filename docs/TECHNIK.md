# GreenwayCash – Technik und Deployment (v1.0)

## Architektur

- Next.js 16 / React 19 / TypeScript mit `output: 'export'`
- Vollständig clientseitige Berechnung in **Integer-Cent** (keine Fließkomma-Euroberechnung)
- `localStorage` (`rosi-v1`, aus Kompatibilitätsgründen weiterhin unverändert) enthält ausschließlich die aktuelle Rechnung und die erfassten Geldbeträge; keine Transaktionshistorie
- Statische PWA: Manifest und Service Worker; kein Backend, keine Datenbank, kein Login
- Bereitstellung unter dem **Domain-Root `/`** über HTTPS

## Projektstruktur

| Datei | Verantwortung |
| --- | --- |
| `src/config/register.json` | Artikel, Preise, Pfand, Kachelpositionen, Haltezeiten |
| `src/lib/calculator.ts` | Warenwert, Pfand und Gesamtbetrag |
| `src/components/ProductTile.tsx` | Darstellung einer Produktkachel |
| `src/components/LongPress.tsx` | Kurz- und Langdruck, Abbruch bei Pointer-Bewegung |
| `src/app/page.tsx` | Aktueller Zustand, Bon, Zahlung, Responsive-Logik |
| `src/components/InstallPrompt.tsx` | Optionaler Installationshinweis für Chromium und iOS/iPadOS |
| `src/app/styles.css` | Layout und Farbschema |
| `src/app/manifest.ts` | PWA-Metadaten |
| `public/sw.js` | Offline-Cache |
| `next.config.ts` | Statischer Export und Entwicklungs-Host |

## Build

```bash
git pull --ff-only origin main
npm install
npm run typecheck
npm run build
```

Das Ergebnis liegt in `out/`. **Nur den Inhalt dieses Verzeichnisses** auf den Webserver übertragen, zum Beispiel mit:

```bash
rsync -av --delete out/ user@webserver:/var/www/rosi/
```

Den Zielpfad anpassen. **Achtung:** `--delete` entfernt Dateien im Zielverzeichnis, die nicht in `out/` liegen; nur für ein ausschließlich dieser Anwendung gewidmetes Verzeichnis verwenden.

Ein Nginx-Beispiel für den statischen Webserver:

```nginx
server {
    listen 80;
    server_name rosi.example.org;
    root /var/www/rosi;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Dieses Beispiel ist für die Anbindung an einen vorgelagerten HTTPS-Reverse-Proxy gedacht; öffentliche Bereitstellung nur über HTTPS. `sw.js` und `manifest.webmanifest` müssen erreichbar sein. Der Export ist für `/` vorgesehen, nicht für einen Unterpfad.

## Cache und Updates

Der Service Worker speichert App-Dateien für den Offlinebetrieb. Bei Änderungen muss der Cache-Stand aktualisiert werden; ältere Browser können bis zum nächsten Online-Aufruf/Reload noch eine vorige Version anzeigen. Vor einer Veranstaltung neue Releases auf dem Zielgerät online laden, dann offline testen.

## Abnahmecheckliste

- `npm run typecheck` und `npm run build` erfolgreich
- Artikel +1/−1 und Langdruck ohne Doppelauslösung
- Pfandpflichtige Artikel und Pfandrückgaben korrekt
- Reine Pfandrückgabe zeigt Auszahlungsbetrag
- Geldtasten, „Passend“, „Zurücksetzen“, Rückgeld und Fehlbetrag
- Clear nur nach 1,2 Sekunden; **keine Wiederherstellung**
- Bon und Zahlungsbereich unabhängig einklappbar
- Tablet und Smartphone in Hoch- und Querformat
- Installation, Offline-Neustart und PWA-Update nach Deployment

GreenwayCash führt keine steuerliche Kassenaufzeichnung und keine Transaktionshistorie.

## Hosting-Hinweis: reservierter `/icons/`-Pfad

Auf einigen Apache-/Plesk-Servern ist `/icons/` ein Webserver-Alias. GreenwayCash verwendet daher für das App-Symbol und die PWA ausschließlich `/app-icons/`. Der Export muss diese Dateien mit enthalten. Bei Aktualisierung des `deploy`-Branches nach dem erneuten Build sollten alte Dateien durch den Deploy-Sync entfernt werden.

## Installationsaufforderung

Die Komponente `InstallPrompt` reagiert auf das nicht standardisierte Chromium-Ereignis `beforeinstallprompt`. **Ob und wann das Ereignis ausgelöst wird, entscheidet der Browser**; eine eigene Aufforderung kann es nicht erzwingen. In iOS/iPadOS wird stattdessen der manuelle Safari-Weg über „Teilen → Zum Home-Bildschirm“ beschrieben. Bereits installierte PWAs (Standalone-Modus) und Geräte, auf denen der Hinweis geschlossen wurde, zeigen keinen Banner. Das Wegklicken wird separat unter `greenwaycash-install-dismissed-v1` in `localStorage` gespeichert.

Wichtig: Die PWA muss über HTTPS erreichbar sein, und das Manifest sowie die App-Icons müssen gültig sein. Bei Chromium sind geeignete Icons in 192 × 192 und 512 × 512 Pixel als PNG für verlässliche Installierbarkeit empfehlenswert. Solange nur das SVG-Icon hinterlegt ist, kann die native Installationsaufforderung je nach Browser ausbleiben. Der Installationshinweis ist kein Ersatz für die technische Installierbarkeit.

### Deployment ohne rsync (eidolon)

```bash
cd /workspaces/local/GreenwayCash
git pull --ff-only origin main
npm run typecheck
npm run build

cd /workspaces/local/GreenwayCash-deploy
# Achtung: ausschließlich im dedizierten Deploy-Worktree ausführen.
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf -- {} +
cp -a ../GreenwayCash/out/. .
git add -A
git commit -m "deploy: GreenwayCash update"
git push origin deploy
```

Anschließend Plesk per Webhook oder „Pull Updates“ aktualisieren.

## Rechtliche Informationen

Die Seite `src/app/impressum/page.tsx` wird beim statischen Build unter `/impressum/` ausgegeben und ist über das (i)-Symbol in der Kopfzeile erreichbar. Das Impressum nennt den Entwickler, enthält aber bis zur Klärung noch Pflichtdaten-Platzhalter für ladungsfähige Anschrift und E-Mail-Adresse. Auch die Datenschutzhinweise müssen um die konkrete Hosting-Datenverarbeitung (z. B. Zugriffslogs, Verantwortlicher, Speicherdauer) ergänzt werden. Der Quellcode oder die Anzeige einer Seite allein belegen keine Rechtskonformität.
