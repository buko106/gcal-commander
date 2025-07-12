gcal-commander
=================

Eine Befehlszeilenschnittstelle für Google Calendar-Operationen. Verwalten Sie Ihre Google Calendar-Ereignisse und -Kalender direkt vom Terminal aus.

> 🤖 Dieses Projekt wird hauptsächlich mit [Claude Code](https://claude.ai/code) entwickelt und demonstriert die Fähigkeiten der KI-unterstützten Entwicklung.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![codecov](https://codecov.io/github/buko106/gcal-commander/graph/badge.svg?token=DQUL68E057)](https://codecov.io/github/buko106/gcal-commander)

## Funktionen

- 📅 **Google Calendar-Ereignisse lesen** - Ereignisse auflisten und detaillierte Informationen anzeigen
- ✏️ **Kalenderereignisse erstellen** - Neue Ereignisse mit flexiblen Zeitoptionen, Teilnehmern und Orten hinzufügen
- 📋 **Mehrere Kalender verwalten** - Zugriff auf alle Ihre Google-Kalender
- 🔐 **Sichere OAuth2-Authentifizierung** - Einmalige Einrichtung mit automatischer Token-Aktualisierung
- 💻 **Terminal-freundliche Ausgabe** - Sauberes Tabellenformat oder JSON für Skripting
- 🔇 **Unterstützung für stillen Modus** - Verwenden Sie die `--quiet`-Flagge, um Statusmeldungen für Skripting zu unterdrücken
- 🚀 **Schnell und leichtgewichtig** - Mit dem oclif-Framework erstellt

## Sprachen

📖 **README in anderen Sprachen:**
- [🇺🇸 English](../../README.md)
- [🇯🇵 日本語 (Japanese)](../ja/README.md)
- [🇪🇸 Español (Spanish)](../es/README.md)

## Installation

```bash
npm install -g gcal-commander
```

## Erste Einrichtung

Bevor Sie gcal-commander verwenden, müssen Sie den Google Calendar-API-Zugang einrichten:

### 1. Google Cloud Console-Einrichtung

1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein vorhandenes aus
3. Aktivieren Sie die Google Calendar-API:
   - Navigieren Sie zu "APIs & Services" > "Library"
   - Suchen Sie nach "Google Calendar API"
   - Klicken Sie darauf und drücken Sie "Enable"

### 2. OAuth 2.0-Anmeldedaten erstellen

1. Gehen Sie zu "APIs & Services" > "Credentials"
2. Klicken Sie auf "Create Credentials" > "OAuth client ID"
3. Falls aufgefordert, konfigurieren Sie den OAuth-Zustimmungsbildschirm:
   - Wählen Sie den Benutzertyp "External"
   - Füllen Sie die erforderlichen Felder aus (Anwendungsname, Benutzer-Support-E-Mail, Entwicklerkontakt)
   - Fügen Sie Ihre E-Mail zu den Testbenutzern hinzu
4. Wählen Sie für den Anwendungstyp "Desktop application"
5. Geben Sie einen Namen ein (z.B. "gcal-commander")
6. Klicken Sie auf "Create"
7. Laden Sie die Anmeldedaten-JSON-Datei herunter

### 3. Anmeldedaten-Datei einrichten

Platzieren Sie die heruntergeladene Anmeldedaten-Datei im gcal-commander-Konfigurationsverzeichnis:

```bash
# Konfigurationsverzeichnis erstellen
mkdir -p ~/.gcal-commander

# Ihre heruntergeladene Anmeldedaten-Datei kopieren
cp ~/Downloads/client_secret_*.json ~/.gcal-commander/credentials.json
```

### 4. Authentifizierung beim ersten Ausführen

Wenn Sie gcal-commander zum ersten Mal ausführen, wird es:

1. Ihren Standard-Browser für die Google OAuth-Authentifizierung öffnen
2. Sie bitten, sich bei Ihrem Google-Konto anzumelden
3. Um Berechtigung für den Zugriff auf Ihren Google Calendar bitten
4. Das Authentifizierungs-Token automatisch speichern

```bash
# Erste Ausführung - dies löst den Authentifizierungsablauf aus
gcal calendars list
```

Das Authentifizierungs-Token wird in `~/.gcal-commander/token.json` gespeichert und bei Bedarf automatisch aktualisiert.

## Grundlegende Verwendung

```bash
# Alle Ihre Kalender auflisten
gcal calendars list

# Anstehende Ereignisse aus Ihrem Hauptkalender auflisten
gcal events list

# Ereignisse aus einem bestimmten Kalender auflisten
gcal events list my-calendar@gmail.com

# Detaillierte Informationen über ein Ereignis anzeigen
gcal events show <event-id>

# Ein neues Ereignis erstellen
gcal events create "Team-Meeting" --start "2024-01-15T14:00:00" --duration 60

# Ein ganztägiges Ereignis erstellen
gcal events create "Konferenz" --start "2024-01-15" --all-day

# Anzahl der Ereignisse und Zeitbereich begrenzen
gcal events list --max-results 5 --days 7

# Stillen Modus für Skripting verwenden (unterdrückt Statusmeldungen)
gcal events list --quiet --format json | jq '.[] | .summary'

# Konfigurationsbeispiele
gcal config set defaultCalendar work@company.com
gcal events list  # Verwendet jetzt work@company.com als Standard
```

## Konfiguration

gcal-commander unterstützt globale Konfiguration zur Anpassung des Standardverhaltens:

```bash
# Standardkalender für Ereignisliste festlegen
gcal config set defaultCalendar work@company.com

# Standard-Anzahl der anzuzeigenden Ereignisse festlegen
gcal config set events.maxResults 25

# Standard-Ausgabeformat festlegen
gcal config set events.format json

# Standard-Zeitbereich (Tage) festlegen
gcal config set events.days 60

# Alle aktuellen Konfigurationen anzeigen
gcal config list

# Spezifischen Konfigurationswert anzeigen
gcal config get defaultCalendar

# Eine Konfigurationseinstellung entfernen
gcal config unset defaultCalendar

# Alle Konfigurationen zurücksetzen
gcal config reset --confirm
```

### Konfigurationsoptionen

- `defaultCalendar` - Standard-Kalender-ID für `gcal events list` (Standard: "primary")
- `events.maxResults` - Standard-Maximalanzahl von Ereignissen (1-100, Standard: 10)
- `events.format` - Standard-Ausgabeformat: "table", "json" oder "pretty-json" (Standard: "table")
- `events.days` - Standard-Anzahl von Tagen zum Vorausschauen (1-365, Standard: 30)
- `language` - Schnittstellensprache: "en", "ja", "es", "de", "pt", "fr" oder "ko" (Standard: "en")

Die Konfiguration wird in `~/.gcal-commander/config.json` gespeichert und kann manuell bearbeitet werden.

## Befehle

gcal-commander bietet mehrere Befehle zur Interaktion mit Google Calendar:

### Kalenderverwaltung
- **[`gcal calendars list`](calendars-list.md)** - Alle verfügbaren Kalender auflisten

### Ereignisverwaltung  
- **[`gcal events list`](events-list.md)** - Anstehende Kalenderereignisse auflisten
- **[`gcal events show`](events-show.md)** - Detaillierte Ereignisinformationen anzeigen
- **[`gcal events create`](events-create.md)** - Neue Kalenderereignisse mit flexiblen Planungsoptionen erstellen

### Konfiguration
- **[`gcal config`](config.md)** - Globale Konfigurationseinstellungen verwalten

### Einrichtung & Authentifizierung
- **[`gcal init`](init.md)** - Interaktive Einrichtung mit Sprachauswahl und Authentifizierungsüberprüfung

### Hilfe
- **`gcal help`** - Hilfe für jeden Befehl anzeigen

Für detaillierte Verwendungsbeispiele und Optionen für jeden Befehl klicken Sie auf die obigen Links, um die umfassende Dokumentation anzuzeigen.

## Beitragen

Wir begrüßen Beiträge zu gcal-commander! Dieses Projekt unterstützt KI-unterstützte Entwicklung.

### Empfohlener Entwicklungsworkflow

- **Verwenden Sie [Claude Code](https://claude.ai/code)** für Entwicklungsunterstützung - von der Implementierung von Funktionen bis hin zu Code-Reviews
- **Qualitätssicherung**: Lassen Sie Claude Code Ihre Änderungen auf Codequalität, bewährte Praktiken und Konsistenz überprüfen
- **Testen**: Stellen Sie sicher, dass alle Tests mit `npm test` bestehen
- **Linting**: Code wird automatisch über Pre-Commit-Hooks gelintet und formatiert

### Entwicklungseinrichtung

1. Repository forken und klonen
2. Abhängigkeiten installieren: `npm install`
3. **Entwicklungsworkflow**:
   - **Für aktive Entwicklung**: Verwenden Sie `./bin/dev.js COMMAND`, um Befehle direkt aus TypeScript-Quelldateien auszuführen (kein Build erforderlich)
   - **Für finales Testen**: Verwenden Sie `npm run build && ./bin/run.js COMMAND`, um den Produktionsbuild zu testen
4. Änderungen vornehmen und Tests ausführen: `npm test`
5. Pull Request einreichen

**CLI-Ausführungsmodi:**
- `./bin/dev.js` - Entwicklungsmodus (TypeScript-Quelldateien mit ts-node, sofortige Änderungen)
- `./bin/run.js` - Produktionsmodus (kompiliertes JavaScript aus dist/, erfordert Build)

Das Projekt verwendet Husky + lint-staged für automatische Code-Qualitätsprüfungen vor Commits.

## Sprachunterstützung

gcal-commander unterstützt Internationalisierung (i18n) und ist in mehreren Sprachen verfügbar:

**Unterstützte Sprachen:**
- **English** (`en`) - Standard
- **Japanese** (`ja`) - 日本語  
- **Spanish** (`es`) - Español
- **German** (`de`) - Deutsch
- **Portuguese** (`pt`) - Português
- **French** (`fr`) - Français
- **Korean** (`ko`) - 한국어

```bash
# Zu Japanisch wechseln
gcal config set language ja

# Zu Spanisch wechseln
gcal config set language es

# Zu Deutsch wechseln
gcal config set language de

# Zu Portugiesisch wechseln
gcal config set language pt

# Zu Französisch wechseln
gcal config set language fr

# Zu Koreanisch wechseln
gcal config set language ko

# Zurück zu Englisch wechseln  
gcal config set language en

# Aktuelle Spracheinstellung anzeigen
gcal config get language
```

Alle Befehlsausgaben, Fehlermeldungen und Statusmeldungen werden in der ausgewählten Sprache angezeigt.