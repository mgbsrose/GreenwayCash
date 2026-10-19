# GreenwayCash – Hinweise für Coding Agents

**Zuerst lesen:** [agents.md](agents.md) – vollständige, dauerhafte Entwicklungsübergabe für die Wiederaufnahme nach Löschung des bisherigen Chats.

Weitere Referenzen: [README.md](README.md), [docs/TECHNIK.md](docs/TECHNIK.md), [docs/KONFIGURATION.md](docs/KONFIGURATION.md), [eidolon-help.md](eidolon-help.md).

## Verbindliche Projektregeln
- Stand 19.10.2026: **GreenwayCash v1.0.0 befindet sich im Betatest**. Nicht ohne Auftrag zum fiskalischen Kassensystem ausbauen.
- Quellbranch **main**, statischer Deployment-Branch **deploy**; dogado/Plesk zieht ausschließlich deploy. Kein Node.js auf dem Webserver.
- Alle Preise/Berechnungen als **Integer-Cent**. Automatisches Pfand für **genau fünf** Produkte (Glühwein, Apfelpunsch, Kakao, Superbecher, Kaffee).
- Produkttap +1, Halten −1; Clear nur nach 1,2 Sekunden, **ohne Undo**.
- Bon anfangs eingeklappt, „Gegeben & Rückgeld“ ausgeklappt.
- `localStorage['rosi-v1']` aus Kompatibilitätsgründen nicht unüberlegt ändern.
- Hostingkonflikt: **/app-icons/** statt **/icons/**.
- Entwicklungscontainer eidolon **ohne sudo/Root und ohne rsync**; bewährte Befehle in `eidolon-help.md`.
- Public Repo: keine Credentials/Tokens einchecken; Impressum/Datenschutz nicht ohne Rechtsprüfung als abschließend rechtskonform bezeichnen.
- Neue Änderungen: Typecheck und Build prüfen, reale Geräte/Offline/PWA bei Bedarf testen; nur tatsächlich durchgeführte Tests behaupten. Dokumentationsübergabe aktuell halten.
