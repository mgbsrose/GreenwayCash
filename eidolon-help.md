# eidolon-help.md – GreenwayCash: Pull, Build und Deployment

Stand: 19.10.2026. Dieses Handbuch ist für den vorhandenen Entwicklungscontainer **eidolon ohne Root-Rechte und ohne rsync** geschrieben.

| Zweck | Pfad / Adresse |
| --- | --- |
| GitHub | https://github.com/mgbsrose/GreenwayCash |
| Source-Branch | `main` |
| Deployment-Branch | `deploy` |
| Source | `/workspaces/local/GreenwayCash` |
| Deploy-Worktree | `/workspaces/local/GreenwayCash-deploy` |
| Fertiger Build | `/workspaces/local/GreenwayCash/out/` |
| Produktion | https://cash.introsinet.de/ |
| Entwicklungsproxy | https://eidolon3000.greenway.home.arpa/ |
| Hosting | dogado / Plesk, **Branch `deploy`** |

## 1. Git-Status prüfen und Änderungen abrufen

```bash
cd /workspaces/local/GreenwayCash
git status -sb
git remote -v
git branch --show-current       # main
git pull --ff-only origin main
```

Wenn `git pull --ff-only` fehlschlägt, zunächst `git status` und `git diff` kontrollieren. **Kein blindes `git reset --hard` oder Force-Push.**

## 2. Entwicklungsserver, Typecheck, Produktionsbuild

```bash
cd /workspaces/local/GreenwayCash
npm install                    # bei Ersteinrichtung/geänderten Abhängigkeiten
npm run dev                    # Entwicklungsserver; Ende: Strg+C

# Zur Veröffentlichung:
npm run typecheck
npm run build
```

Der Production-Build erzeugt die **rein statischen Dateien** unter `out/`, darunter `index.html`, `impressum/index.html`, `_next/`, `app-icons/`, `manifest.webmanifest`, `sw.js`. **Build ist noch keine Veröffentlichung.**

```bash
test -f out/index.html && echo "Startseite OK"
test -f out/impressum/index.html && echo "Impressum OK"
test -f out/manifest.webmanifest && echo "Manifest OK"
test -f out/app-icons/icon.svg && echo "Icon OK"
test -f out/sw.js && echo "Service Worker OK"
```

## 3. Fertigen Build ohne rsync auf den Deployment-Branch übernehmen

**Achtung:** Nachfolgendes `find` löscht Dateien im aktuell ausgewählten Verzeichnis. Nur im dafür vorgesehenen **Deploy-Worktree** ausführen.

```bash
# Quellcode aktuell halten und neu bauen
cd /workspaces/local/GreenwayCash
git pull --ff-only origin main
npm run typecheck
npm run build

# Deploy-Worktree betreten und Sicherheitskontrolle
cd /workspaces/local/GreenwayCash-deploy
pwd                              # MUSS /workspaces/local/GreenwayCash-deploy sein
git branch --show-current        # MUSS deploy sein
git status -sb                   # vor dem Löschen auf lokale Änderungen prüfen
test -f ../GreenwayCash/out/index.html && echo "Build vorhanden"

# NUR wenn alle Prüfungen stimmen: alten Deploy-Inhalt entfernen,
# die .git-Datei des Worktrees erhalten
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf -- {} +

# Kompletten Export kopieren – nicht das Verzeichnis out/ als Unterordner
cp -a ../GreenwayCash/out/. .

# Änderungen prüfen und auf GitHub veröffentlichen
git status --short
git add -A
git diff --cached --stat
git commit -m "deploy: GreenwayCash update"
git push origin deploy
```

**Falls `nothing to commit`:** Kein Dateiunterschied; bei reinen Markdown-Dokumentationsänderungen normal. Falls `Author identity unknown` kommt, einmalig im Worktree konfigurieren:

```bash
git config user.name "Stefan Rosenkranz"
git config user.email "DEINE-GITHUB-EMAIL"
```

Wenn das bestehende Deployment-Verzeichnis auf `deploy` nicht sauber ist, vor dem Löschen die Änderungen prüfen. `GreenwayCash-deploy/.git` ist bei Git-Worktrees eine Datei, die erhalten bleiben muss.

## 4. Plesk/dogado: Git-Pull und Website prüfen

1. Plesk → Git der Subdomain `cash.introsinet.de`.
2. Remote `https://github.com/mgbsrose/GreenwayCash.git`, **Branch `deploy`**, Zielpfad = Document Root der Subdomain.
3. Nach Push bei Bedarf **Pull Updates** in Plesk. Ein funktionierender GitHub-Webhook ist noch nicht bestätigt.
4. Produktive Website und PWA auf echtem Smartphone/Tablet neu laden und testen.

Prüf-URLs:
- https://cash.introsinet.de/
- https://cash.introsinet.de/impressum/
- https://cash.introsinet.de/manifest.webmanifest
- https://cash.introsinet.de/app-icons/icon.svg
- https://cash.introsinet.de/sw.js

**Nicht `/icons/` verwenden:** dogado/Apache kann dort eigene Servericons anzeigen. GreenwayCash liegt unter `/app-icons/`.

## 5. Änderungen auf main selbst committen

```bash
cd /workspaces/local/GreenwayCash
git status
git diff
git add README.md docs/ agents.md AGENTS.md eidolon-help.md    # Beispiel: gezielt stage
git commit -m "docs: update documentation"
git push origin main
```

Wenn die Änderungen bereits auf GitHub vorgenommen wurden, lokal **nur pullen**. Dokumentation in `main` wird nicht in den statischen `deploy`-Branch kopiert.

## 6. Häufige Fehler

| Problem | Abhilfe |
| --- | --- |
| `rsync: command not found` | Bewährte `find`/`cp -a`-Variante aus Abschnitt 3 |
| `Author identity unknown` | `git config user.name` und `git config user.email` |
| `src refspec deploy does not match any` | Initialer `deploy`-Commit fehlt oder Branch falsch |
| `nothing to commit` | Build-Dateien unverändert oder Kopieren vergessen |
| Alte Website trotz Push | Branch `deploy`, Plesk Pull und SW-/Browsercache prüfen |
| PWA bietet keine Installation | Browserbedingungen prüfen; derzeit nur SVG-Icon im Manifest |
| Offline-Probleme | SW/Fallback und vollständigen Online-Erstaufruf prüfen, siehe `docs/TECHNIK.md` |

## 7. Später wieder einsteigen

Erst [README.md](README.md), [agents.md](agents.md), [docs/TECHNIK.md](docs/TECHNIK.md) lesen und den Betateststand erfassen. Der dokumentierte Stand ist **v1.0.0 im Betatest**, keine freigegebene neue Version.
