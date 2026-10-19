# JSON-Konfiguration

Die Konfiguration befindet sich in `src/config/register.json`.

- `depositCents`: Pfand pro Getränk in Cent
- `longPressMs` und `clearPressMs`: Haltezeiten in Millisekunden
- `denominationsCents`: Geldtasten in Cent
- `buttons`: Produkte und Pfandrückgabe mit `id`, `title`, `icon`, `priceCents`, `deposit`, `type`, `color`, `layout`

`layout` enthält für `tabletLandscape`, `tabletPortrait`, `mobileLandscape` und `mobilePortrait` jeweils `[x,y,w,h]` in einem 12-Spalten-CSS-Grid mit 14 Rasterzeilen. Koordinaten beginnen bei 1.

Alle Preise als **ganze Centbeträge** speichern. Änderungen an der JSON-Datei erfordern einen neuen Build.

## Preise (Stand Oktober 2026)

| Artikel | Preis | Automatisches Pfand |
| --- | ---: | :---: |
| Kaffee | 1,50 € | Ja |
| Kakao | 2,00 € | Ja |
| Superbecher | 3,00 € | Ja |
| Glühwein | 3,00 € | Ja |
| Apfelpunsch | 2,50 € | Ja |
| mit Sahne | 0,50 € | Nein |
| mit Schuss | 0,50 € | Nein |
| Softdrinks | 1,00 € | Nein |
| Wasser | 1,00 € | Nein |
| Bier | 2,00 € | Nein |
| Bier (Alkoholfrei) | 2,00 € | Nein |
| Schnaps | 1,50 € | Nein |

Pfand je Becher: **2,00 €**. Pfandpflichtig sind Kaffee, Kakao, Superbecher, Glühwein und Apfelpunsch.

Breite Ansichten: vier Reihen mit drei Produkten; darunter Pfandrückgabe über acht Spalten und die rote Clear-Kachel über vier Spalten. Smartphone-Hochformat: zwei Produktspalten, Pfandrückgabe und Clear teilen sich die letzte Rasterzeile. Clear wird separat in `src/app/page.tsx` positioniert und ist kein Eintrag in `buttons`.
