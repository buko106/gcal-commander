# gcal calendars list

List all available calendars accessible through your Google account.

## Usage

```bash
gcal calendars list [options]
```

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--format` | `-f` | Output format (table or json) | `table` |
| `--quiet` | `-q` | Suppress status messages | `false` |

## Examples

### Basic Usage

```bash
# List all calendars in table format
gcal calendars list

# List calendars in JSON format
gcal calendars list --format json

# List calendars quietly (no status messages)
gcal calendars list --quiet
```

### Output Formats

**Table Format (default):**
```
Calendar ID                    Summary
────────────────────────────────────────────────────────
primary                        John Doe
work@company.com              Work Calendar
family@gmail.com              Family Events
```

**JSON Format:**
```json
[
  {
    "id": "primary",
    "summary": "John Doe",
    "primary": true,
    "accessRole": "owner"
  },
  {
    "id": "work@company.com",
    "summary": "Work Calendar",
    "accessRole": "owner"
  }
]
```

## Use Cases

- **Discovering available calendars** - See all calendars you have access to
- **Finding calendar IDs** - Get the exact calendar ID for use with other commands
- **Scripting** - Use with `--format json` to parse calendar data programmatically
- **Quick overview** - Check which calendars are available before listing events

## Integration with Other Commands

The calendar IDs returned by this command can be used with:

- [`gcal events list <calendar-id>`](events-list.md) - List events from a specific calendar
- [`gcal events show <event-id> --calendar <calendar-id>`](events-show.md) - Show event details from a specific calendar
- [`gcal config set defaultCalendar <calendar-id>`](config.md) - Set a default calendar

## Related Commands

- [`gcal events list`](events-list.md) - List events from calendars
- [`gcal config`](config.md) - Configure default calendar settings