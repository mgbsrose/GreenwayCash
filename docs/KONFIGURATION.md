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

## Mandantenkonfiguration anhand der URL (v1.1, erster Schritt)

Die Dateien `src/config/default.json`, `src/config/spmz2026.json`, `src/config/stmagnus_getraenke2026.json`, `src/config/stmagnus_speisen2026.json` sind die aktiven Mandantenkonfigurationen. `src/config/register.json` bleibt vorläufig nur als Legacy-Kopie erhalten und wird **nicht** mehr von der App geladen. Die vier neuen Dateien wurden als Kopien der vorhandenen Getränkekonfiguration angelegt, inklusive der zuletzt geänderten Farben. Die beiden St.-Magnus-Dateien enthalten **noch keine individuell abgestimmten Produkte oder Preise**.

Die Eigenschaft `customer` wird in der Titelzeile angezeigt. Aufruf `/` verwendet `default.json`; `/<name>` verwendet `<name>.json`, falls vorhanden und gültig, sonst `default.json`. Groß-/Kleinschreibung und Dateiname müssen übereinstimmen; zulässig sind Kleinbuchstaben, Zahlen, Bindestrich und Unterstrich. Es gibt **keine feste Routenliste**.

Beim `npm run dev` und `npm run build` kopiert `scripts/sync-config.mjs` automatisch die neuen Dateien aus `src/config/` nach `public/config/` (im Export `out/config/`). Der Ordner `public/config/` ist generiert und in Git ignoriert. Bei Apache/Plesk muss die `out/.htaccess` für den URL-Fallback ausgeliefert werden. Der Settings-Dialog ist **noch nicht** implementiert. Der Warenkorb wird pro Konfigurationsname unter einem getrennten `localStorage`-Schlüssel abgelegt; nur `/` behält `rosi-v1`.

## Konkrete Mandanten und Routen (22.10.2026)

Die drei bisherigen Dateinamen wurden ersetzt: `spmz_wm_2026.json`, `stmagnus_wm_getraenke_2026.json` und `stmagnus_wm_speisen_2026.json`. `default.json` bleibt unverändert. Die bisherigen Dateinamen sind entfernt; es werden keine Redirects eingerichtet.

**Spielmannszug:** bestehende Farben, Artikel, Preise und Pfandregeln beibehalten. Der bisherige Titel „Bier (Alkoholfrei)“ wurde zu „Bier / Radler“ und „Alkoholfrei“ auf zwei Zeilen geändert. Die JSON-Datei enthält einen normalen Zeilenumbruch (als `\\n` kodiert), und `ProductTile` verwendet `white-space: pre-line`. **Keine HTML-Tags in Artikeltiteln**.

**St. Magnus Getränke:** fünf Produkte, jeweils 2,00 € und `deposit: false`; `depositCents: 0`: Westheimer Pilsener (0,2 l Glas), Westheimer Alkoholfrei (0,33 l Flasche), Westheimer Radler (0,33 l Flasche), Cola / Fanta (0,33 l Flasche), Wasser (0,33 l Flasche). Keine Pfandrückgabe-Kachel.

**St. Magnus Speisen:** vier Produkte, alle ohne Pfand (`depositCents: 0`): Bratwurst mit Brot (2,50 €), Currywurst mit Brot (2,70 €), Pommes Frites (3,00 €), Mantaplatte (6,00 €). Für die Speisen wurden zusätzliche Lucide-Symbole in `ProductTile.tsx` ergänzt. Das Raster füllt die verfügbaren Zeilen 1–12; die separate Clear-Kachel bleibt in Zeile 13–14.

**Achtung:** Die bisherigen Beschreibungen des zwölfteiligen Getränkesortiments gelten nur noch für `default.json` und den Spielmannszug. St. Magnus hat andere Kachelzahlen und kein Pfand.


### Vereinheitlichung der Default-Konfiguration (22.10.2026)

`src/config/register.json` wurde entfernt. `default.json` ist ab sofort eine **vollständige Kopie** von `spmz_wm_2026.json` einschließlich des mehrzeiligen Artikeltitels `Bier / Radler\\nAlkoholfrei`, aller Farben, Preise und Layouts sowie `customer`. `src/config/spmz_wm_2026.json` bleibt die maßgebliche Spielmannszug-Datei; falls deren Sortiment künftig geändert wird, wird `default.json` nicht automatisch synchronisiert.


## Automatische Auswahlliste (v1.1)

Das Build-Script `scripts/sync-config.mjs` erzeugt aus allen `src/config/*.json` (außer der historischen, inzwischen entfernten `register.json`) eine Liste mit `id` (Dateiname ohne `.json`) und `customer`. Diese wird als `public/config/index.json` bzw. `out/config/index.json` ausgeliefert. Das Modal im Header liest diese Datei und verlinkt auf `/<id>/`; `default` führt auf `/`. Neue Stände benötigen **keine Programmänderung**. Es wird kein Settings-Dialog implementiert.
