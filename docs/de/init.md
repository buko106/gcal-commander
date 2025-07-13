# gcal init

Interaktive Einrichtung mit Sprachauswahl und Google Calendar-Authentifizierungsverifizierung.

## Verwendung

```bash
gcal init [optionen]
```

## Optionen

| Flag | Kurz | Beschreibung | Standard |
|------|------|--------------|----------|
| `--format` | `-f` | Ausgabeformat (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Nicht-wesentliche Ausgabe ausblenden (Statusmeldungen, Fortschrittsanzeigen) | `false` |

## Beschreibung

Der `init`-Befehl bietet eine interaktive Einrichtungserfahrung, die Ihnen hilft:

1. **Ihre bevorzugte Sprache auswählen** aus den unterstützten Optionen (Englisch, Japanisch, Spanisch, Deutsch, Portugiesisch, Französisch, Koreanisch)
2. **Google Calendar-Authentifizierung verifizieren** durch Testen Ihrer Verbindung zur Google Calendar API

Es stellt sicher, dass:
- Ihre Benutzeroberflächensprache nach Ihren Wünschen konfiguriert ist
- Anmeldedateien sind ordnungsgemäß eingerichtet
- Authentifizierungstokens sind gültig
- Sie haben Zugriff auf Google Calendar

Dieser Befehl ist besonders nützlich für:
- Ersteinrichtung von gcal-commander
- Fehlerbehebung bei Authentifizierungsproblemen
- Überprüfung der Einrichtung nach Änderungen an den Anmeldedaten

## Beispiele

### Grundlegende Verwendung

```bash
# Authentifizierung mit Bestätigungsaufforderung überprüfen
gcal init

# Authentifizierung stumm überprüfen (für Scripts)
gcal init --quiet
```

## Interaktiver Ablauf

Beim Ausführen von `gcal init` sehen Sie eine Bestätigungsaufforderung für die Authentifizierungsüberprüfung:

```
Dies wird die Google Calendar-Authentifizierung überprüfen.
? Authentifizierung überprüfen? (Y/n) 
```

- Drücken Sie Enter oder geben Sie `y` ein, um mit der Überprüfung fortzufahren
- Geben Sie `n` ein, um die Operation abzubrechen

**Hinweis**: Die anfängliche Statusnachricht "Dies wird die Google Calendar-Authentifizierung überprüfen." wird immer angezeigt, auch bei Verwendung des `--quiet`-Flags. Das `--quiet`-Flag blendet nur die Fortschrittsnachricht "Google Calendar-Authentifizierung wird überprüft..." aus.

## Erfolgreiche Ausgabe

Wenn die Authentifizierung erfolgreich ist:

```
✓ Google Calendar-Authentifizierung wird überprüft...
Authentifizierung erfolgreich!
```

## Fehlerbehandlung

Wenn die Authentifizierung fehlschlägt, sehen Sie eine Fehlermeldung mit Fehlerbehebungsinformationen:

```
✗ Google Calendar-Authentifizierung wird überprüft...
Authentifizierungsfehler: [Fehlerdetails]
Versuchen Sie den Befehl erneut oder überprüfen Sie Ihre Google Calendar API-Anmeldedaten.
```

Häufige Authentifizierungsfehler:
- Fehlende oder ungültige Anmeldedatei
- Abgelaufene Authentifizierungstokens
- Unzureichende Berechtigungen
- Netzwerkverbindungsprobleme

## Voraussetzungen

Bevor Sie `gcal init` ausführen, stellen Sie sicher, dass Sie haben:

1. **Google Calendar API aktiviert** - Aktiviert in der Google Cloud Console
2. **OAuth 2.0-Anmeldedaten** - Heruntergeladen und in `~/.gcal-commander/credentials.json` platziert
3. **Netzwerkzugriff** - Zugriff auf Googles APIs

Wenn Sie die Authentifizierung noch nicht eingerichtet haben, folgen Sie der Anleitung zur [Ersteinrichtung](../README.md#ersteinrichtung) in der README.

## Fehlerbehebung

### Authentifizierungsfehler

Wenn `gcal init` fehlschlägt:

1. **Anmeldedatei überprüfen**: Stellen Sie sicher, dass `~/.gcal-commander/credentials.json` existiert und gültige OAuth 2.0-Anmeldedaten enthält
2. **Token regenerieren**: Löschen Sie `~/.gcal-commander/token.json` und führen Sie einen beliebigen gcal-Befehl aus, um sich erneut zu authentifizieren
3. **API-Zugriff überprüfen**: Bestätigen Sie, dass die Google Calendar API in der Google Cloud Console aktiviert ist
4. **Netzwerk überprüfen**: Stellen Sie sicher, dass Sie Internetverbindung haben und Googles Server erreichen können

### Dateiberechtigungen

Bei Berechtigungsfehlern:

```bash
# Dateiberechtigungen überprüfen
ls -la ~/.gcal-commander/

# Berechtigungen bei Bedarf korrigieren
chmod 600 ~/.gcal-commander/credentials.json
chmod 600 ~/.gcal-commander/token.json
```

## Anwendungsfälle

- **Ersteinrichtungsüberprüfung** - Bestätigen, dass die Authentifizierung nach der Einrichtung funktioniert
- **Fehlerbehebung** - Authentifizierungsprobleme diagnostizieren
- **CI/CD-Integration** - Authentifizierung in automatisierten Umgebungen überprüfen
- **Gesundheitsprüfung** - Regelmäßig überprüfen, dass die Authentifizierung noch gültig ist

## Verwandte Befehle

- [`gcal calendars list`](calendars-list.md) - Verfügbare Kalender auflisten (testet auch Authentifizierung)
- [`gcal events list`](events-list.md) - Ereignisse auflisten (erfordert Authentifizierung)
- [`gcal config`](config.md) - Konfiguration verwalten

## Referenzen

- [Ersteinrichtungsanleitung](../README.md#ersteinrichtung) - Vollständige Einrichtungsschritte
- [Google Calendar API-Einrichtung](https://console.cloud.google.com/) - Google Cloud Console