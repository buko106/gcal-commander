# gcal events list

List upcoming calendar events from a specified calendar or your default calendar.

## Usage

```bash
gcal events list [calendar] [options]
```

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `calendar` | Calendar ID to list events from | `primary` (or configured default) |

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--days` | `-d` | Number of days to look ahead (1-365) | `30` |
| `--format` | `-f` | Output format (table, json, or pretty-json) | `table` |
| `--max-results` | `-n` | Maximum number of events to return (1-100) | `10` |
| `--quiet` | `-q` | Suppress status messages | `false` |

## Configuration Support

This command supports global configuration defaults:

- `defaultCalendar` - Default calendar to use when none specified
- `events.days` - Default number of days to look ahead
- `events.format` - Default output format
- `events.maxResults` - Default maximum number of events

See [`gcal config`](config.md) for details on setting these values.

## Examples

### Basic Usage

```bash
# List events from primary calendar
gcal events list

# List events from a specific calendar
gcal events list work@company.com

# List events for the next 7 days
gcal events list --days 7

# List up to 20 events
gcal events list --max-results 20
```

### Advanced Usage

```bash
# Combine multiple options
gcal events list personal@gmail.com --days 14 --max-results 5 --format json

# Quiet mode for scripting
gcal events list --quiet --format json | jq '.[] | .summary'

# Use configured defaults
gcal config set defaultCalendar work@company.com
gcal config set events.days 14
gcal events list  # Uses work@company.com for 14 days
```

### Output Formats

**Table Format (default):**
```
Upcoming Events (2 found):

1. Team Meeting
   Mon Jan 15 • 9:00 AM - 10:00 AM
   Weekly team sync meeting

2. Project Review
   Tue Jan 16 • 2:00 PM - 3:30 PM @ Conference Room A
```

**JSON Format:**
```json
[
  {
    "id": "abc123",
    "summary": "Team Meeting",
    "start": {
      "dateTime": "2024-01-15T09:00:00-08:00"
    },
    "end": {
      "dateTime": "2024-01-15T10:00:00-08:00"
    },
    "description": "Weekly team sync meeting"
  }
]
```

## Time Range and Limits

- **Days Range**: Any positive integer (negative values look backward in time)
- **Max Results**: Minimum of 1 event (enforced by Google Calendar API)
- **Time Zone**: Events are displayed in your local timezone
- **Past Events**: Only future/current events are shown

## Scripting and Automation

### Extract Event Titles
```bash
gcal events list --format json --quiet | jq -r '.[].summary'
```

### Get Today's Events Only
```bash
gcal events list --days 1 --format json
```

### Count Upcoming Events
```bash
gcal events list --format json --quiet | jq 'length'
```

## Use Cases

- **Daily planning** - Check what's coming up in your calendar
- **Calendar overview** - Get a quick view of upcoming events
- **Scripting** - Extract event data for automation or reporting
- **Multi-calendar management** - Compare events across different calendars

## Related Commands

- [`gcal calendars list`](calendars-list.md) - Find available calendar IDs
- [`gcal events show`](events-show.md) - Get detailed information about specific events
- [`gcal config`](config.md) - Set default values for this command