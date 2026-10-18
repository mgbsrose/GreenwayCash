# JSON-Konfiguration

Die Konfiguration befindet sich in `src/config/register.json`.

- `depositCents`: Pfand pro Getränk in Cent
- `longPressMs` und `clearPressMs`: Haltezeiten in Millisekunden
- `denominationsCents`: Geldtasten in Cent
- `buttons`: Produkte und Pfandrückgabe mit `id`, `title`, `icon`, `priceCents`, `deposit`, `type`, `color`, `layout`

`layout` enthält für `tabletLandscape`, `tabletPortrait`, `mobileLandscape` und `mobilePortrait` jeweils `[x,y,w,h]` in einem 12×12-CSS-Grid. Koordinaten beginnen bei 1.

Alle Preise als **ganze Centbeträge** speichern. Änderungen an der JSON-Datei erfordern einen neuen Build.
