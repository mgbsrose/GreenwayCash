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
