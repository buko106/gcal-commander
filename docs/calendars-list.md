# gcal calendars list

List all available calendars accessible through your Google account.

## Usage

```bash
gcal calendars list [options]
```

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--fields` | | Comma-separated list of fields to display in table format | All fields |
| `--format` | `-f` | Output format (table, json, or pretty-json) | `table` |
| `--quiet` | `-q` | Suppress non-essential output (status messages, progress indicators) | `false` |

## Examples

### Basic Usage

```bash
# List all calendars in table format
gcal calendars list

# List calendars in JSON format
gcal calendars list --format json

# List calendars quietly (no status messages)
gcal calendars list --quiet

# Show only calendar names and IDs
gcal calendars list --fields name,id

# Show only names (useful for quick overview)
gcal calendars list --fields name
```

### Output Formats

**Table Format (default):**
```
Available Calendars (3 found):

1. John Doe (Primary)
   ID: primary
   Access: owner

2. Work Calendar
   ID: work@company.com
   Access: owner

3. Family Events
   ID: family@gmail.com
   Access: reader
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

## Table Field Customization

You can customize which columns are displayed in table format using the `--fields` flag:

### Available Fields
- `name` - Calendar name/summary
- `id` - Calendar ID
- `access` - Access role (owner, reader, writer, etc.)
- `primary` - Primary calendar indicator
- `description` - Calendar description
- `color` - Calendar color

### Examples
```bash
# Show only name and ID (most common use case)
gcal calendars list --fields name,id

# Show name, ID, and access role
gcal calendars list --fields name,id,access

# Show only names for quick overview
gcal calendars list --fields name

# Show calendar colors and access
gcal calendars list --fields name,color,access
```

**Note**: The `--fields` flag only affects table format output. JSON output always includes all available fields.

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