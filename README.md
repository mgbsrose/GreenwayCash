# GreenwayCash – Version 1.0

**GreenwayCash** ist eine installierbare, offlinefähige Rechenhilfe für den Getränkeverkauf auf dem Weihnachtsmarkt. **Keine elektronische Registrierkasse**, keine Umsatzaufzeichnung, keine Datenbank und kein Backend.

## Funktionen

- Getränk antippen: Menge +1; lange halten (600 ms): Menge −1, nicht unter null
- Automatische Pfandberechnung für Kaffee, Kakao, Superbecher, Glühwein und Apfelpunsch (je 2,00 €)
- Pfandrückgabe unabhängig von einem Verkauf; auch reine Auszahlungen möglich
- Einklappbarer Bon mit Warenwert, Pfand, Pfandrückgabe und Gesamtsumme
- Separat einklappbare Geldtasten, „Passend“, „Zurücksetzen“, Rückgeld und Fehlbetrag
- Rote **Clear**-Kachel: 1,2 Sekunden halten; **kein Rückgängig**
- Responsive Oberfläche für Smartphone und Tablet; Smartphone-Bon als Overlay mit unscharfem Hintergrund
- Aktuelle Rechnung im lokalen Browser-Speicher; Offlinebetrieb über Service Worker
- Konfigurierbare Preise, Produkte und Raster in `src/config/register.json`

## Repository und Entwicklung

Quellcode: [github.com/mgbsrose/GreenwayCash](https://github.com/mgbsrose/GreenwayCash).

Falls das Repository lokal noch unter dem alten Namen geklont ist, mit `git remote set-url origin https://github.com/mgbsrose/GreenwayCash.git` den Remote aktualisieren. Der lokale Ordner kann unabhängig davon umbenannt werden.

## Entwicklung

Voraussetzung: Node.js in einer mit Next.js 16 kompatiblen Version.

```bash
git pull --ff-only origin main
npm install
npm run dev
```

## Produktionsbuild und Veröffentlichung

```bash
npm run typecheck
npm run build
```

Der statische Export liegt anschließend in **`out/`**. Den **gesamten Inhalt** von `out/` in das Document Root des Webservers kopieren. Dazu gehören `index.html`, `_next/`, `manifest.webmanifest`, `sw.js` und `app-icons/`. Auf dem Webserver ist **kein Node.js-Prozess** erforderlich.

**HTTPS ist für die installierbare PWA und den Service Worker erforderlich** (Ausnahme: lokales `localhost`). Die Anwendung erwartet die Bereitstellung am Domain-Root `/`. Ein Unterverzeichnis erfordert weitere Konfiguration.

Nach einem Update gegebenenfalls die PWA neu laden; den Offlinebetrieb und das Update-Verhalten auf dem Zielgerät prüfen. Details: [Technik und Deployment](docs/TECHNIK.md).

## Dokumentation

- [Bedienung](docs/BEDIENUNG.md)
- [Konfiguration und Preise](docs/KONFIGURATION.md)
- [Technik, Deployment und Testcheckliste](docs/TECHNIK.md)

## Status

**Version 1.0 – Funktionsumfang festgelegt.** Der produktive Einsatz setzt einen erfolgreichen Build und die Prüfung auf den tatsächlich verwendeten Geräten voraus. GreenwayCash ersetzt keine gesetzlich vorgeschriebenen Kassen- oder Aufzeichnungspflichten.

## Lizenz

[MIT](LICENSE) · Copyright © 2026 Stefan Rosenkranz.

### Hinweis zu Plesk/Apache

Die Bilder liegen unter `app-icons/` statt `icons/`, weil Hosting-Umgebungen den URL-Pfad `/icons/` für eigene Apache-Verzeichnisse reservieren können.
