# gcal config

Verwaltet die globale Konfiguration von gcal-commander. Stellt Standardwerte für Befehle ein, um Ihre Erfahrung anzupassen.

## Verwendung

```bash
gcal config <unterbefehl> [schlüssel] [wert] [optionen]
```

## Unterbefehle

| Unterbefehl | Beschreibung |
|-------------|--------------|
| `get <schlüssel>` | Einen Konfigurationswert abrufen |
| `set <schlüssel> <wert>` | Einen Konfigurationswert setzen |
| `list` | Alle Konfiguration auflisten |
| `unset <schlüssel>` | Eine Konfiguration entfernen |
| `reset` | Alle Konfiguration auf Standardwerte zurücksetzen |

## Optionen

| Flag | Beschreibung |
|------|--------------|
| `--confirm` | Bestätigung beim Zurücksetzen überspringen |
| `--format` | Ausgabeformat (table, json, pretty-json) |
| `--quiet` | Nicht-wesentliche Ausgabe ausblenden (Statusmeldungen, Fortschrittsanzeigen) |

## Konfigurationsschlüssel

### Kernkonfiguration

| Schlüssel | Beschreibung | Standard | Gültige Werte |
|-----------|--------------|----------|---------------|
| `defaultCalendar` | Standard-Kalender für das Auflisten von Ereignissen | `primary` | Jede Kalender-ID |
| `language` | Anzeigesprache | `en` | `en`, `ja` |

### Standardwerte für Ereignisbefehle

| Schlüssel | Beschreibung | Standard | Gültige Werte |
|-----------|--------------|----------|---------------|
| `events.maxResults` | Standard-Maximalanzahl zurückzugebender Ereignisse | `10` | `1-100` |
| `events.format` | Standard-Ausgabeformat | `table` | `table`, `json`, `pretty-json` |
| `events.days` | Standard-Tage für Vorausschau | `30` | `1-365` |

## Beispiele

### Grundkonfiguration

```bash
# Standard-Kalender festlegen
gcal config set defaultCalendar work@company.com

# Aktuellen Standard-Kalender abrufen
gcal config get defaultCalendar

# Alle aktuelle Konfiguration auflisten
gcal config list

# Eine Konfiguration entfernen (zum Standard zurückkehren)
gcal config unset defaultCalendar
```

### Sprachkonfiguration

```bash
# Zu Deutsch wechseln
gcal config set language de

# Zu Englisch wechseln
gcal config set language en

# Aktuelle Spracheinstellung überprüfen
gcal config get language
```

### Standardwerte für Ereignisbefehle

```bash
# Standard-Anzahl angezeigter Ereignisse festlegen
gcal config set events.maxResults 25

# Standard-Zeitbereich festlegen
gcal config set events.days 60

# Standard-Ausgabeformat festlegen
gcal config set events.format json

# Ereigniseinstellungen anzeigen
gcal config get events.maxResults
gcal config get events.days
gcal config get events.format
```

### Konfigurationsverwaltung

```bash
# Alle Konfiguration im Tabellenformat anzeigen
gcal config list

# Alle Konfiguration im JSON-Format anzeigen
gcal config list --format json

# Alle Konfiguration zurücksetzen (mit Bestätigung)
gcal config reset

# Alle Konfiguration zurücksetzen (Bestätigung überspringen)
gcal config reset --confirm
```

## Ausgabeformate

### list-Befehl - Tabellenformat (Standard)
```
Schlüssel               Wert
────────────────────────────────────
defaultCalendar         work@company.com
language                de
events.maxResults       25
events.format           json
events.days             60
```

### list-Befehl - JSON-Format
```json
{
  "defaultCalendar": "work@company.com",
  "language": "de",
  "events": {
    "maxResults": 25,
    "format": "json",
    "days": 60
  }
}
```

### get-Befehl
```bash
$ gcal config get defaultCalendar
work@company.com
```

## Konfigurationsdatei

Die Konfiguration wird in `~/.gcal-commander/config.json` gespeichert:

```json
{
  "defaultCalendar": "work@company.com",
  "language": "de",
  "events": {
    "maxResults": 25,
    "format": "table",
    "days": 60
  }
}
```

Sie können diese Datei bei Bedarf manuell bearbeiten, aber die Verwendung des config-Befehls wird empfohlen.

## Häufige Workflows

### Arbeitsumgebung einrichten
```bash
# Konfiguration für die Arbeit
gcal config set defaultCalendar work@company.com
gcal config set events.maxResults 20
gcal config set events.days 14
gcal config set events.format table
gcal config set language de
```

### Script-Umgebung einrichten
```bash
# Konfiguration für Automatisierung/Scripts
gcal config set events.format json
gcal config set events.maxResults 100
gcal config set language en
```

### Verwaltung mehrerer Kalender
```bash
# Primären Arbeitskalender festlegen
gcal config set defaultCalendar primary-work@company.com

# Diesen Kalender standardmäßig in Ereignislisten verwenden
gcal events list  # Verwendet primary-work@company.com

# Für spezifische Abfragen überschreiben
gcal events list personal@gmail.com
```

## Validierung

Konfigurationswerte werden beim Setzen validiert:

- **Kalender-IDs**: Nicht validiert bis zur ersten Verwendung
- **Zahlenbereiche**: `maxResults` (1-100), `days` (1-365)
- **Aufzählungen**: `format` muss "table", "json" oder "pretty-json" sein
- **Sprache**: `language` muss "en" oder "ja" sein
- **Ungültige Werte**: Befehl zeigt Fehler und aktuelle gültige Optionen an

## Auswirkungen auf Befehle

Die Konfiguration beeinflusst das Standardverhalten von Befehlen:

### [`gcal events list`](events-list.md)
- Verwendet `defaultCalendar`, wenn kein Kalender angegeben ist
- Verwendet `events.maxResults` als Standard für `--max-results`
- Verwendet `events.format` als Standard für `--format`
- Verwendet `events.days` als Standard für `--days`

### [`gcal events show`](events-show.md)
- Verwendet `defaultCalendar` als Standard für `--calendar`, wenn nicht angegeben

### Alle Befehle
- Zeigen Nachrichten basierend auf der `language`-Einstellung an

Kommandozeilen-Flags überschreiben immer Konfigurationsstandards.

## Fehlerbehebung

### Konfiguration zurücksetzen
Bei Problemen mit der Konfiguration:
```bash
gcal config reset --confirm
```

### Aktuelle Konfiguration anzeigen
```bash
gcal config list --format json
```

### Spezifische Konfiguration überprüfen
```bash
gcal config get defaultCalendar
```

## Verwandte Befehle

- [`gcal events list`](events-list.md) - Verwendet Konfigurationsstandards
- [`gcal events show`](events-show.md) - Verwendet Konfigurationsstandards
- [`gcal calendars list`](calendars-list.md) - Kalender-IDs für Konfiguration finden