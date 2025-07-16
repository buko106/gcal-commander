# gcal events list

Listet bevorstehende Kalenderereignisse aus dem angegebenen oder Standard-Kalender auf.

## Verwendung

```bash
gcal events list [kalender] [optionen]
```

## Argumente

| Argument | Beschreibung | Standard |
|----------|--------------|----------|
| `kalender` | Kalender-ID, aus der Ereignisse aufgelistet werden sollen | `primary` |

## Optionen

| Flag | Kurz | Beschreibung | Standard |
|------|------|--------------|----------|
| `--days` | `-d` | Anzahl der Tage in die Zukunft (1-365) | `30` |
| `--fields` | | Kommagetrennte Liste der Felder für Tabellenformat | Alle Felder |
| `--format` | `-f` | Ausgabeformat (table, json, pretty-json) | `table` |
| `--max-results` | `-n` | Maximale Anzahl zurückzugebender Ereignisse (1-100) | `10` |
| `--quiet` | `-q` | Nicht-wesentliche Ausgabe ausblenden (Statusmeldungen, Fortschrittsanzeigen) | `false` |

## Konfigurationsunterstützung

Dieser Befehl unterstützt globale Konfigurationsstandards:

- `defaultCalendar` - Standard-Kalender, wenn keiner angegeben ist
- `events.days` - Standard-Anzahl der Tage in die Zukunft
- `events.format` - Standard-Ausgabeformat
- `events.maxResults` - Standard-Maximalanzahl von Ereignissen

Siehe [`gcal config`](config.md) für Details zum Setzen dieser Werte.

## Beispiele

### Grundlegende Verwendung

```bash
# Ereignisse aus dem primären Kalender auflisten
gcal events list

# Ereignisse aus einem bestimmten Kalender auflisten
gcal events list work@company.com

# Ereignisse für die nächsten 7 Tage auflisten
gcal events list --days 7

# Bis zu 20 Ereignisse auflisten
gcal events list --max-results 20
```

### Erweiterte Verwendung

```bash
# Mehrere Optionen kombinieren
gcal events list personal@gmail.com --days 14 --max-results 5 --format json

# Stummer Modus für Scripts
gcal events list --quiet --format json | jq '.[] | .summary'

# Konfigurierte Standardwerte verwenden
gcal config set defaultCalendar work@company.com
gcal config set events.days 14
gcal events list  # Verwendet work@company.com für 14 Tage

# Tabellenspalten anpassen
gcal events list --fields title,date,time
gcal events list --fields title,location --max-results 20
```

### Ausgabeformate

**Tabellenformat (Standard):**
```
Bevorstehende Ereignisse (2 gefunden):

1. Team-Besprechung
   15. Januar (Mo) • 9:00 - 10:00
   Wöchentliche Team-Synchronisation

2. Projekt-Review
   16. Januar (Di) • 14:00 - 15:30 @ Konferenzraum A
```

**JSON-Format:**
```json
[
  {
    "id": "abc123",
    "summary": "Team-Besprechung",
    "start": {
      "dateTime": "2024-01-15T09:00:00-08:00"
    },
    "end": {
      "dateTime": "2024-01-15T10:00:00-08:00"
    },
    "description": "Wöchentliche Team-Synchronisation"
  }
]
```

## Tabellenfeld-Anpassung

Sie können anpassen, welche Spalten im Tabellenformat angezeigt werden, indem Sie die `--fields`-Flagge verwenden:

### Verfügbare Felder
- `title` - Ereignistitel/-zusammenfassung
- `date` - Ereignisdatum
- `time` - Ereigniszeit
- `location` - Ereignisort
- `description` - Ereignisbeschreibung

### Beispiele
```bash
# Nur Titel und Datum anzeigen
gcal events list --fields title,date

# Titel, Zeit und Ort anzeigen
gcal events list --fields title,time,location

# Nur Titel anzeigen (für schnelle Übersicht)
gcal events list --fields title
```

**Hinweis**: Die `--fields`-Flagge wirkt nur auf die Tabellenformat-Ausgabe. JSON-Ausgabe enthält immer alle verfügbaren Felder.

## Zeitbereiche und Limits

- **Tagesbereich**: 1-365 Tage ab heute
- **Maximale Ergebnisse**: 1-100 Ereignisse pro Anfrage
- **Zeitzone**: Ereignisse werden in der lokalen Zeitzone angezeigt
- **Vergangene Ereignisse**: Nur zukünftige/aktuelle Ereignisse werden angezeigt

## Scripting und Automatisierung

### Ereignistitel extrahieren
```bash
gcal events list --format json --quiet | jq -r '.[].summary'
```

### Nur heutige Ereignisse abrufen
```bash
gcal events list --days 1 --format json
```

### Bevorstehende Ereignisse zählen
```bash
gcal events list --format json --quiet | jq 'length'
```

## Anwendungsfälle

- **Tagesplanung** - Bevorstehende Termine in Ihrem Kalender überprüfen
- **Kalenderübersicht** - Schnelle Überprüfung bevorstehender Ereignisse
- **Scripting** - Ereignisdaten für Automatisierung oder Berichte extrahieren
- **Verwaltung mehrerer Kalender** - Ereignisse zwischen verschiedenen Kalendern vergleichen

## Verwandte Befehle

- [`gcal calendars list`](calendars-list.md) - Verfügbare Kalender-IDs finden
- [`gcal events show`](events-show.md) - Detaillierte Informationen zu spezifischen Ereignissen abrufen
- [`gcal config`](config.md) - Standardwerte für diesen Befehl setzen