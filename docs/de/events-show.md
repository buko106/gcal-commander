# gcal events show

Zeigt detaillierte Informationen zu einem bestimmten Kalenderereignis an.

## Verwendung

```bash
gcal events show <event-id> [optionen]
```

## Argumente

| Argument | Beschreibung | Erforderlich |
|----------|--------------|--------------|
| `event-id` | ID des Ereignisses, für das Details angezeigt werden sollen | Ja |

## Optionen

| Flag | Kurz | Beschreibung | Standard |
|------|------|--------------|----------|
| `--calendar` | `-c` | Kalender-ID, in dem das Ereignis existiert | `primary` |
| `--format` | `-f` | Ausgabeformat (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Nicht-wesentliche Ausgabe ausblenden (Statusmeldungen, Fortschrittsanzeigen) | `false` |

## Beispiele

### Grundlegende Verwendung

```bash
# Ereignisdetails aus dem primären Kalender anzeigen
gcal events show abc123def456

# Ereignis aus einem bestimmten Kalender anzeigen
gcal events show abc123def456 --calendar work@company.com

# Ereignisdetails im JSON-Format abrufen
gcal events show abc123def456 --format json
```

### Erweiterte Verwendung

```bash
# Ereignis stumm anzeigen (für Scripts)
gcal events show abc123def456 --quiet --format json

# Ereignis aus bestimmtem Kalender im JSON-Format anzeigen
gcal events show abc123def456 --calendar team@company.com --format json
```

## Ereignis-IDs abrufen

Ereignis-IDs können abgerufen werden von:

1. **Ausgabe des `gcal events list`-Befehls**
2. **Google Calendar-URLs** (die lange Zeichenkette in der URL)
3. **Calendar API-Antworten** (bei Verwendung des JSON-Formats)

Beispiel zum Finden von Ereignis-IDs:
```bash
# Nach IDs in der Ereignisliste suchen
gcal events list --format json | jq '.[] | {id, summary}'
```

## Ausgabeformate

**Tabellenformat (Standard):**
```
=== Ereignisdetails ===

Titel: Team-Besprechung
ID: abc123def456
Beschreibung: Wöchentliche Team-Synchronisation
Ort: Konferenzraum A
Status: confirmed
Start: 15. Januar 2024 (Mo) • 9:00
Ende: 15. Januar 2024 (Mo) • 10:00
Ersteller: Thomas Müller
Organisator: Maria Schmidt

Teilnehmer:
  1. thomas@company.com (accepted)
  2. maria@company.com (tentative)

Google Calendar-Link: https://calendar.google.com/event?eid=...
Erstellt: 10.1.2024 8:30:00
Letzte Aktualisierung: 12.1.2024 15:45:00
```

**JSON-Format:**
```json
{
  "id": "abc123def456",
  "summary": "Team-Besprechung",
  "description": "Wöchentliche Team-Synchronisation",
  "start": {
    "dateTime": "2024-01-15T09:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "end": {
    "dateTime": "2024-01-15T10:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "location": "Konferenzraum A",
  "attendees": [
    {
      "email": "thomas@company.com",
      "responseStatus": "accepted"
    },
    {
      "email": "maria@company.com",
      "responseStatus": "needsAction"
    }
  ],
  "status": "confirmed",
  "created": "2024-01-10T08:30:00.000Z",
  "updated": "2024-01-12T15:45:00.000Z"
}
```

## Angezeigte Ereignisdetails

Dieser Befehl zeigt umfassende Ereignisinformationen einschließlich:

- **Grundinformationen**: Titel, Beschreibung, Ereignis-ID
- **Zeitinformationen**: Start-/Endzeiten mit Zeitzoneninformationen
- **Ort**: Physischer oder virtueller Besprechungsort
- **Teilnehmer**: E-Mail-Adressen und Antwortstatus
- **Status**: Ereignisstatus (confirmed, tentative, cancelled)
- **Metadaten**: Erstellungsdatum und letzte Aktualisierungszeitstempel
- **Wiederholung**: Wiederholungsregeln (falls zutreffend)
- **Erinnerungen**: Standard- und überschriebene Erinnerungen

## Häufige Anwendungsfälle

### Ereignisüberprüfung
```bash
# Ereignisdetails vor einer Besprechung schnell überprüfen
gcal events show $(gcal events list --format json | jq -r '.[0].id')
```

### Teilnehmerinformationen
```bash
# E-Mail-Adressen der Ereignisteilnehmer extrahieren
gcal events show abc123 --format json | jq -r '.attendees[]?.email'
```

### Raumbuchungsüberprüfung
```bash
# Ort und Zeitdetails überprüfen
gcal events show abc123 | grep -E "(Ort|Start|Ende)"
```

### Ereignisdatenexport
```bash
# Vollständige Ereignisdaten für externe Verarbeitung abrufen
gcal events show abc123 --format json --quiet > event-details.json
```

## Fehlerbehandlung

Häufige Fehler und Lösungen:

- **Ereignis nicht gefunden**: Ereignis-ID und Kalender überprüfen
- **Zugriff verweigert**: Zugriffsberechtigungen für den angegebenen Kalender überprüfen
- **Ungültige Ereignis-ID**: Ereignis-ID-Format und -quelle überprüfen

## Verwandte Befehle

- [`gcal events list`](events-list.md) - Ereignis-IDs für die Verwendung mit diesem Befehl finden
- [`gcal calendars list`](calendars-list.md) - Verfügbare Kalender-IDs finden
- [`gcal config`](config.md) - Standardeinstellungen konfigurieren