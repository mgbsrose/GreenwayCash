# GreenwayCash – Konfiguration und Preise (Oktober 2026)

Die Produkte und Einstellungen liegen in [`src/config/register.json`](../src/config/register.json). **Änderungen erfordern einen neuen statischen Build und Deployment.** Keine Backend-Administration.

## Globale Einstellungen
| Feld | Bedeutung |
| --- | --- |
| `name` | Anzeigename |
| `depositCents` | Pfand: **200 Cent** |
| `longPressMs` | Haltezeit zum Dekrementieren: **600 ms** |
| `clearPressMs` | Haltezeit zum unwiderruflichen Clear: **1200 ms** |
| `denominationsCents` | Geldtasten **10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000** Cent |
| `buttons` | Artikel mit `id`, `title`, `priceCents`, `deposit`, `type`, `color`, `layout` und ggf. `icon` |

Preise immer in **ganzen Cent**. Bestehende IDs möglichst nicht umbenennen, weil die gespeicherten Mengen per ID referenziert werden.

## Aktuelle Artikel
| Artikel | Preis | Pfand automatisch |
| --- | ---: | :---: |
| Glühwein | 3,00 € | Ja |
| Apfelpunsch | 2,50 € | Ja |
| mit Schuss | 0,50 € | Nein |
| Kakao | 2,00 € | Ja |
| Superbecher | 3,00 € | Ja |
| mit Sahne | 0,50 € | Nein |
| Bier | 2,00 € | Nein |
| Bier (Alkoholfrei) | 2,00 € | Nein |
| Schnaps | 1,50 € | Nein |
| Kaffee | 1,50 € | Ja |
| Softdrinks | 1,00 € | Nein |
| Wasser | 1,00 € | Nein |
| Pfand zurück | −2,00 € | Nein |

**Genau fünf Pfandartikel:** Glühwein, Apfelpunsch, Kakao, Superbecher, Kaffee. Pfand je Becher 2,00 €. „Pfand zurück“ ist `type: 'return'` und ein negativer Betrag; Zusätze erhalten kein eigenes Pfand.

## Raster und Farben
`layout` besteht aus `tabletLandscape`, `tabletPortrait`, `mobileLandscape` und `mobilePortrait`. Ein Eintrag `[x,y,w,h]` positioniert die Kachel im 12-Spalten-/14-Zeilen-CSS-Grid (1-basierte Koordinaten). Unter 700px nutzt die App ein Mobile-Layout; Hoch-/Querformat bestimmt die Variante.

Große Ansichten: vier Reihen × drei Getränke, unten Pfandrückgabe über 8 Spalten und **separate** rote Clear-Kachel über 4 Spalten. Smartphone-Hochformat: zwei Produktspalten. Clear wird in `src/app/page.tsx` gerendert, **nicht in JSON**.

Bier und alkoholfreies Bier **gelb**, Kaffee **dunkleres Braun**, Kakao/Superbecher **gleiches hellbraun**, Sahne **cremefarben**. Artikelnamen derzeit 16px, auf Smartphone 14px.

## Preisänderungen während des Betatests
Eine noch offene Rechnung im Browser liegt unter `localStorage['rosi-v1']` und kann nach Preisupdates mit den **neuen** Preisen berechnet werden. Preis-/Pfandänderungen nicht mitten im Verkauf ausrollen. Nach jeder Änderung `npm run typecheck`, `npm run build`, Geräteprüfung und Deployment gemäß [eidolon-help.md](../eidolon-help.md).
