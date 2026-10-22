# GreenwayCash – Anleitung für Betatester (v1.0.0)

**App:** https://cash.introsinet.de/ · **Stand:** Oktober 2026. GreenwayCash ist eine Rechenhilfe, keine steuerliche Registrierkasse.

## Bedienung
1. **Artikel:** kurz antippen = Menge +1; etwa 600 ms halten = Menge −1. Nie unter null.
2. **Pfand:** Glühwein, Apfelpunsch, Kakao, Superbecher und Kaffee: automatisch je 2,00 € pro Getränk.
3. **Pfand zurück:** pro Becher −2,00 €; funktioniert auch ohne Neukauf („Auszuzahlen“).
4. **Bon:** auf Tablets rechts, auf Smartphones über „Bon anzeigen“. **Anfangs eingeklappt**, Summe bleibt sichtbar; über Pfeil aufklappbar.
5. **Gegeben & Rückgeld:** **anfangs ausgeklappt**. Geldtasten antippen = hinzufügen, halten = abziehen. „Passend“ setzt den exakten Betrag; „Zurücksetzen“ leert nur die Geldbeträge. Rückgeld bzw. „Noch offen“ wird berechnet.
6. **Clear:** rote Kachel **1,2 Sekunden gedrückt halten**. Menge und Geld werden **unwiderruflich** gelöscht. Kein Rückgängig.
7. **(i):** Projektinformationen, Impressum, Datenschutz. **(?):** Hilfe und optionales Display-Wachhalten (falls Browser unterstützt).

Die laufende Rechnung wird nur lokal im jeweiligen Browser gespeichert. Kein geräteübergreifender Abgleich; Browserdaten löschen kann den Zustand entfernen.

## Installation und Offline
- Chrome/Edge: Wenn der Browser die Installation unterstützt, kann „App installieren“ eingeblendet werden.
- iPhone/iPad: In Safari „Teilen“ → „Zum Home-Bildschirm“. Die Benennung kann je nach iOS-Version abweichen.
- Die Installationsaufforderung lässt sich schließen und erscheint danach im selben Browser nicht mehr.
- Für Offlinebetrieb **zuerst online vollständig laden**, danach im Flugmodus Start, Auswahl, Pfand, Rückgeld und die installierte App testen. Die bloße Installation garantiert den Offlinebetrieb nicht.

## Empfohlene Betatests
- [ ] Jede Artikelkachel antippen und halten; keine versehentlichen Doppeleingaben
- [ ] Alle fünf Pfandartikel und Rückgabe ohne Einkauf prüfen
- [ ] Geldbeträge, Passend, Zurücksetzen, Rückgeld und Fehlbetrag prüfen
- [ ] Clear 1,2 Sekunden, ohne Undo
- [ ] Bon beim Start zu, Zahlbereich beim Start offen; beide unabhängig einklappbar
- [ ] Smartphones und Tablets, Hoch-/Querformat, (i)/(?) gleich ausgerichtet
- [ ] Installation, Offline-Neustart, App-Update, Impressum

Fehler bitte mit Gerät/Browser, reproduzierbaren Schritten, erwartetem und tatsächlichem Ergebnis melden. Keine personenbezogenen Zahlungsinformationen sammeln.


## Zwischen Ständen wechseln (v1.1)

Rechts oben das **Preislisten-Symbol** öffnen; im Modal **„Stand auswählen“** einen Eintrag antippen. Die App navigiert unmittelbar zur URL des gewählten Standes. Die Auswahl ist keine Einstellung: Produkte und Preise werden ausschließlich aus der jeweiligen JSON-Datei geladen. Die aktuelle Rechnung ist je Stand getrennt gespeichert. Das Modal über X, Escape oder Tippen außerhalb schließen.


**Ab Version 1.1:** Der Dialogtitel lautet „Preisliste“. Die Standard-Preisliste ist mit „(Default)“ gekennzeichnet, damit sie vom gleich aufgebauten Spielmannszug-Sortiment unterschieden werden kann.
