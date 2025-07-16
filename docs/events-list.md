# gcal events list

List upcoming calendar events from a specified calendar or your default calendar.

## Usage

```bash
gcal events list [calendar] [options]
```

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `calendar` | Calendar ID to list events from | `primary` |

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--days` | `-d` | Number of days to look ahead (1-365) | `30` |
| `--fields` | | Comma-separated list of fields to display in table format | All fields |
| `--format` | `-f` | Output format (table, json, or pretty-json) | `table` |
| `--max-results` | `-n` | Maximum number of events to return (1-100) | `10` |
| `--quiet` | `-q` | Suppress non-essential output (status messages, progress indicators) | `false` |

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

# Customize table columns
gcal events list --fields title,date,time
gcal events list --fields title,location --max-results 20
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

## Table Field Customization

You can customize which columns are displayed in table format using the `--fields` flag:

### Available Fields
- `title` - Event title/summary
- `date` - Event date 
- `time` - Event time
- `location` - Event location
- `description` - Event description

### Examples
```bash
# Show only title and date
gcal events list --fields title,date

# Show title, time, and location
gcal events list --fields title,time,location

# Show only titles (useful for quick overview)
gcal events list --fields title
```

**Note**: The `--fields` flag only affects table format output. JSON output always includes all available fields.

## Time Range and Limits

- **Days Range**: 1-365 days from today
- **Max Results**: 1-100 events per request
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