# 🎄 ROSI zählt für euch!

**ROSI** ist eine installierbare, offlinefähige Rechenhilfe für den Getränkeverkauf am Weihnachtsmarkt. Kein Kassensystem, keine Umsatzaufzeichnung, kein Backend.

## Funktionen

- Tippen auf ein Getränk: **+1**; langes Drücken: **−1**
- Automatisches Pfand für konfigurierte Getränke und separate Pfandrückgabe
- Bon mit Positionen, Warenwert, Pfand und Gesamtsumme
- Geldtasten, **Passend**, automatische Rückgeldberechnung
- **Clear** durch langes Drücken, anschließend **Rückgängig**
- Smartphone: dauerhaft sichtbare Gesamtsumme und einblendbarer Bon; Tablet: Bon rechts
- Lokale Speicherung der laufenden Rechnung und Offline-PWA
- Preise, Produkte und Layout über JSON konfigurierbar

## Start

Node.js in einer für Next.js 16 unterstützten Version vorausgesetzt.

```bash
npm install
npm run dev
```

Produktionsbuild:

```bash
npm run typecheck
npm run build
```

Das Verzeichnis `out/` als statische Website über HTTPS ausliefern. PWA einmal online laden und anschließend Offline-Neustart testen.

## Dokumentation

- [Bedienung](docs/BEDIENUNG.md)
- [Konfiguration](docs/KONFIGURATION.md)
- [Technik und Deployment](docs/TECHNIK.md)

## Status

**v0.1 – Prototyp, nicht produktiv abgenommen.** Touch-, Build-, Pfand- und Offline-Tests auf Zielgeräten erforderlich. Keine steuerliche Kassenfunktion.

## Lizenz

[MIT](LICENSE) · Copyright © 2026 Stefan Rosenkranz.
