# gcal events create

Erstellt neue Kalenderereignisse mit flexiblen Terminplanungsoptionen, Teilnehmern und Metadaten.

## Verwendung

```bash
gcal events create <zusammenfassung> [optionen]
```

## Argumente

| Argument | Beschreibung | Erforderlich |
|----------|--------------|--------------|
| `zusammenfassung` | Ereignistitel/-zusammenfassung | Ja |

## Optionen

| Flag | Kurz | Beschreibung | Standard |
|------|------|--------------|----------|
| `--start` | `-s` | Startdatum und -zeit (ISO-Format) | Erforderlich |
| `--end` | `-e` | Enddatum und -zeit (ISO-Format) | - |
| `--duration` | `-d` | Dauer in Minuten (Alternative zu --end) | `60` |
| `--all-day` | | Ganztägiges Ereignis erstellen | `false` |
| `--calendar` | `-c` | Kalender-ID, in dem das Ereignis erstellt werden soll | `primary` |
| `--location` | `-l` | Ort des Ereignisses | - |
| `--description` | | Beschreibung des Ereignisses | - |
| `--attendees` | | Kommagetrennte Liste von Teilnehmer-E-Mail-Adressen | - |
| `--send-updates` | | Ereigniseinladungen senden (all/externalOnly/none) | `none` |
| `--fields` | | Kommagetrennte Liste der Felder für Tabellenformat | Alle Felder |
| `--format` | `-f` | Ausgabeformat (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Nicht-wesentliche Ausgabe ausblenden (Statusmeldungen, Fortschrittsanzeigen) | `false` |

## Zeitangabe

### Ereignisse mit Uhrzeit
Verwenden Sie ISO 8601-Format für Datum und Uhrzeit:
```bash
# Grundformat
gcal events create "Besprechung" --start "2024-01-15T14:00:00"

# Mit Zeitzone
gcal events create "Telefonkonferenz" --start "2024-01-15T14:00:00-08:00"
```

### Ganztägige Ereignisse
Verwenden Sie nur Datumsformat (YYYY-MM-DD):
```bash
gcal events create "Konferenz" --start "2024-01-15" --all-day
```

### Dauer vs. Endzeit
- Verwenden Sie `--duration` in Minuten für Bequemlichkeit
- Verwenden Sie `--end` für eine spezifische Endzeit
- Sie können nicht sowohl `--end` als auch `--duration` angeben

## Beispiele

### Grundlegende Ereigniserstellung

```bash
# Einfache 1-Stunden-Besprechung (Standarddauer)
gcal events create "Team-Besprechung" --start "2024-01-15T14:00:00"

# Besprechung mit spezifischer Dauer
gcal events create "Morning Stand-up" --start "2024-01-15T09:00:00" --duration 30

# Besprechung mit spezifischer Endzeit
gcal events create "Projekt-Review" --start "2024-01-15T14:00:00" --end "2024-01-15T16:00:00"
```

### Ganztägige Ereignisse

```bash
# Eintägiges Ereignis
gcal events create "Konferenz" --start "2024-01-15" --all-day

# Mehrtägiges Ereignis (Enddatum ist exklusiv)
gcal events create "Urlaub" --start "2024-01-15" --end "2024-01-20" --all-day
```

### Ereignisse mit Metadaten

```bash
# Besprechung mit Ort
gcal events create "Kundenbesprechung" \
  --start "2024-01-15T14:00:00" \
  --duration 90 \
  --location "Konferenzraum A"

# Ereignis mit Beschreibung
gcal events create "Sprint-Planung" \
  --start "2024-01-15T10:00:00" \
  --duration 120 \
  --description "Aufgabenplanung für den nächsten Sprint"
```

### Ereignisse mit Teilnehmern

```bash
# Teilnehmer ohne Einladungen hinzufügen
gcal events create "Team-Sync" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com"

# Einladungen an Teilnehmer senden
gcal events create "Wichtige Besprechung" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com" \
  --send-updates all
```

### Verschiedene Kalender

```bash
# In Arbeitskalender erstellen
gcal events create "Sprint-Demo" \
  --start "2024-01-15T15:00:00" \
  --calendar work@company.com

# In persönlichem Kalender erstellen
gcal events create "Arzttermin" \
  --start "2024-01-15T10:00:00" \
  --calendar personal@gmail.com
```

### Erweiterte Beispiele

```bash
# Vollständige Besprechungseinrichtung
gcal events create "Quartalsreview" \
  --start "2024-01-15T14:00:00" \
  --end "2024-01-15T17:00:00" \
  --location "Hauptkonferenzraum" \
  --description "Q4-Ergebnisse und Q1-Planung" \
  --attendees "team@company.com,manager@company.com" \
  --calendar work@company.com \
  --send-updates all

# JSON-Ausgabe für Scripts
gcal events create "Automatisiertes Ereignis" \
  --start "2024-01-15T14:00:00" \
  --format json --quiet
```

## Ausgabeformate

**Tabellenformat (Standard):**
```
Ereignis erfolgreich erstellt!

Titel: Team-Besprechung
ID: abc123def456
Start: 15.1.2024 14:00:00
Ende: 15.1.2024 15:00:00
Ort: Konferenzraum A
Google Calendar-Link: https://calendar.google.com/event?eid=...
```

**JSON-Format:**
```json
{
  "id": "abc123def456",
  "summary": "Team-Besprechung",
  "start": {
    "dateTime": "2024-01-15T14:00:00-08:00"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00-08:00"
  },
  "location": "Konferenzraum A",
  "htmlLink": "https://calendar.google.com/event?eid=..."
}
```

## Teilnehmerverwaltung

### Einladungsoptionen
- `none` (Standard) - Teilnehmer hinzufügen, aber keine Einladungen senden
- `all` - Einladungen an alle Teilnehmer senden
- `externalOnly` - Einladungen nur an externe Teilnehmer senden

### Teilnehmerformat
E-Mail-Adressen durch Kommas getrennt angeben:
```bash
--attendees "alice@company.com,bob@external.com,charlie@company.com"
```

## Zeitzonenbehandlung

- **Lokale Zeit**: Wenn keine Zeitzone angegeben ist, wird die lokale Zeitzone verwendet
- **Explizite Zeitzone**: Zeitzonenversatz im ISO-Format einschließen
- **Ganztägige Ereignisse**: Nur Datumsformat, zeitzonenunabhängig

## Validierung und Fehlerbehandlung

### Häufige Fehler
- **Ungültiges Datumsformat**: ISO 8601-Format für Ereignisse mit Uhrzeit überprüfen
- **Sowohl end als auch duration angeben**: Sie können nicht sowohl `--end` als auch `--duration` angeben
- **Ungültige Dauer**: Muss eine positive Ganzzahl (Minuten) sein
- **Datum in der Vergangenheit**: Warnung wird angezeigt, aber Ereignis wird erstellt

### Datumsformat-Beispiele
```bash
# Gültige Formate
--start "2024-01-15T14:00:00"           # Lokale Zeitzone
--start "2024-01-15T14:00:00-08:00"     # Pazifische Zeit
--start "2024-01-15T22:00:00Z"          # UTC
--start "2024-01-15" --all-day          # Ganztägiges Ereignis

# Ungültige Formate
--start "15. Januar 2024"               # ISO-Format verwenden
--start "14:00"                         # Datum fehlt
```

## Anwendungsfälle

- **Besprechungsplanung** - Besprechungen mit Teilnehmern und Orten erstellen
- **Ereignisplanung** - Konferenzen, Workshops, soziale Ereignisse einrichten
- **Persönliche Erinnerungen** - Termine und persönliche Ereignisse erstellen
- **Wiederholungseinrichtung** - Vorlagenereignisse für manuelle Wiederholung erstellen
- **Automatisierung** - Scripts zur Ereigniserstellung aus externen Systemen

## Verwandte Befehle

- [`gcal events list`](events-list.md) - Erstellte Ereignisse anzeigen
- [`gcal events show`](events-show.md) - Detaillierte Ereignisinformationen abrufen
- [`gcal calendars list`](calendars-list.md) - Verfügbare Kalender-IDs finden
- [`gcal config`](config.md) - Standardeinstellungen konfigurieren