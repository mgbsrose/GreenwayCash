# Technik und Deployment

Next.js 16, React 19, TypeScript und statischer Export. Kein Backend. Berechnungen erfolgen in Cent; aktuelle Mengen und Geldbeträge werden im Browser gespeichert.

- `src/config/register.json`: Preise, Pfand, Raster
- `src/lib/calculator.ts`: Summenberechnung
- `src/components/LongPress.tsx`: Touch-Interaktion
- `src/app/page.tsx`: Bedienoberfläche
- `src/app/styles.css`: Layout
- `src/app/manifest.ts`: PWA-Manifest
- `public/sw.js`: Service Worker

```bash
npm install
npm run typecheck
npm run build
```

Den Ordner `out/` vollständig per HTTPS ausliefern. Bei Releases Service-Worker-Cache versionieren.

## Abnahme

- Mengen, langer Druck und kein versehentlicher Doppelklick
- Pfand, Pfandrückgabe und negative Rechnungen
- Geldtasten, Passend, Rückgeld, Fehlbetrag
- Clear und Rückgängig
- Tablet/Smartphone, Hoch-/Querformat
- Offline-Neustart nach Installation
- Update einer installierten PWA

Keine Transaktionshistorie, kein Kassensystem und keine geräteübergreifende Synchronisation.
