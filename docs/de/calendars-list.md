# gcal calendars list

Listet alle über Ihr Google-Konto zugänglichen Kalender auf.

## Verwendung

```bash
gcal calendars list [optionen]
```

## Optionen

| Flag | Kurz | Beschreibung | Standard |
|------|------|--------------|----------|
| `--fields` | | Kommagetrennte Liste der Felder für Tabellenformat | Alle Felder |
| `--format` | `-f` | Ausgabeformat (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Nicht-wesentliche Ausgabe ausblenden (Statusmeldungen, Fortschrittsanzeigen) | `false` |

## Beispiele

### Grundlegende Verwendung

```bash
# Alle Kalender im Tabellenformat auflisten
gcal calendars list

# Kalender im JSON-Format auflisten
gcal calendars list --format json

# Kalender stumm auflisten (ohne Statusmeldungen)
gcal calendars list --quiet

# Nur Kalendernamen und IDs anzeigen
gcal calendars list --fields name,id

# Nur Namen anzeigen (für schnelle Übersicht)
gcal calendars list --fields name
```

### Ausgabeformate

**Tabellenformat (Standard):**
```
Verfügbare Kalender (3 gefunden):

1. Thomas Müller (Primär)
   ID: primary
   Zugriff: owner

2. Arbeitskalender
   ID: work@company.com
   Zugriff: owner

3. Familienereignisse
   ID: family@gmail.com
   Zugriff: reader
```

**JSON-Format:**
```json
[
  {
    "id": "primary",
    "summary": "Thomas Müller",
    "primary": true,
    "accessRole": "owner"
  },
  {
    "id": "work@company.com",
    "summary": "Arbeitskalender",
    "accessRole": "owner"
  }
]
```

## Tabellenfeld-Anpassung

Sie können anpassen, welche Spalten im Tabellenformat angezeigt werden, indem Sie die `--fields`-Flagge verwenden:

### Verfügbare Felder
- `name` - Kalendername/-zusammenfassung
- `id` - Kalender-ID
- `access` - Zugriffsrolle (owner, reader, writer, etc.)
- `primary` - Primärkalender-Indikator
- `description` - Kalenderbeschreibung
- `color` - Kalenderfarbe

### Beispiele
```bash
# Nur Name und ID anzeigen (häufigster Anwendungsfall)
gcal calendars list --fields name,id

# Name, ID und Zugriffsrolle anzeigen
gcal calendars list --fields name,id,access

# Nur Namen für schnelle Übersicht anzeigen
gcal calendars list --fields name

# Kalenderfarben und Zugriff anzeigen
gcal calendars list --fields name,color,access
```

**Hinweis**: Die `--fields`-Flagge wirkt nur auf die Tabellenformat-Ausgabe. JSON-Ausgabe enthält immer alle verfügbaren Felder.

## Anwendungsfälle

- **Kalender-Entdeckung** - Alle Kalender anzeigen, auf die Sie Zugriff haben
- **Kalender-ID-Suche** - Exakte Kalender-IDs für andere Befehle erhalten
- **Scripting** - Kalenderdaten programmatisch mit `--format json` analysieren
- **Schnelle Übersicht** - Verfügbare Kalender vor dem Auflisten von Ereignissen überprüfen

## Integration mit anderen Befehlen

Die von diesem Befehl zurückgegebenen Kalender-IDs können verwendet werden in:

- [`gcal events list <calendar-id>`](events-list.md) - Ereignisse aus einem bestimmten Kalender auflisten
- [`gcal events show <event-id> --calendar <calendar-id>`](events-show.md) - Ereignisdetails aus einem bestimmten Kalender anzeigen
- [`gcal config set defaultCalendar <calendar-id>`](config.md) - Standard-Kalender festlegen

## Verwandte Befehle

- [`gcal events list`](events-list.md) - Ereignisse aus Kalendern auflisten
- [`gcal config`](config.md) - Standard-Kalendereinstellungen konfigurieren