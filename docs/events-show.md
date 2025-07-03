# gcal events show

Show detailed information about a specific calendar event.

## Usage

```bash
gcal events show <event-id> [options]
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `event-id` | Event ID to show details for | Yes |

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--calendar` | `-c` | Calendar ID where the event is located | `primary` |
| `--format` | `-f` | Output format (table, json, or pretty-json) | `table` |
| `--quiet` | `-q` | Suppress non-essential output (status messages, progress indicators) | `false` |

## Examples

### Basic Usage

```bash
# Show event details from primary calendar
gcal events show abc123def456

# Show event from a specific calendar
gcal events show abc123def456 --calendar work@company.com

# Get event details in JSON format
gcal events show abc123def456 --format json
```

### Advanced Usage

```bash
# Show event quietly (for scripting)
gcal events show abc123def456 --quiet --format json

# Show event from specific calendar in JSON
gcal events show abc123def456 --calendar team@company.com --format json
```

## Getting Event IDs

Event IDs can be obtained from:

1. **`gcal events list`** command output
2. **Google Calendar URLs** (the long string in the URL)
3. **Calendar API responses** when using JSON format

Example of finding an event ID:
```bash
# List events to find the ID
gcal events list --format json | jq '.[] | {id, summary}'
```

## Output Formats

**Table Format (default):**
```
=== Event Details ===

Title: Team Meeting
ID: abc123def456
Description: Weekly team sync meeting
Location: Conference Room A
Status: confirmed
Start: Mon Jan 15, 2024 • 9:00 AM
End: Mon Jan 15, 2024 • 10:00 AM 
Creator: John Doe
Organizer: Jane Smith

Attendees:
  1. john@company.com (accepted)
  2. jane@company.com (tentative)

Google Calendar Link: https://calendar.google.com/event?eid=...
Created: 1/10/2024, 8:30:00 AM
Last Updated: 1/12/2024, 3:45:00 PM
```

**JSON Format:**
```json
{
  "id": "abc123def456",
  "summary": "Team Meeting",
  "description": "Weekly team sync meeting",
  "start": {
    "dateTime": "2024-01-15T09:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "end": {
    "dateTime": "2024-01-15T10:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "location": "Conference Room A",
  "attendees": [
    {
      "email": "john@company.com",
      "responseStatus": "accepted"
    },
    {
      "email": "jane@company.com",
      "responseStatus": "needsAction"
    }
  ],
  "status": "confirmed",
  "created": "2024-01-10T08:30:00.000Z",
  "updated": "2024-01-12T15:45:00.000Z"
}
```

## Event Details Shown

The command displays comprehensive event information including:

- **Basic Info**: Title, description, event ID
- **Timing**: Start/end times with timezone information
- **Location**: Physical or virtual meeting location
- **Attendees**: Email addresses and response status
- **Status**: Event status (confirmed, tentative, cancelled)
- **Metadata**: Creation and last updated timestamps
- **Recurrence**: Recurrence rules (if applicable)
- **Reminders**: Default and override reminders

## Common Use Cases

### Event Verification
```bash
# Quickly check event details before a meeting
gcal events show $(gcal events list --format json | jq -r '.[0].id')
```

### Attendee Information
```bash
# Extract attendee emails for an event
gcal events show abc123 --format json | jq -r '.attendees[]?.email'
```

### Meeting Room Booking Check
```bash
# Check location and timing details
gcal events show abc123 | grep -E "(Location|Start|End)"
```

### Export Event Data
```bash
# Get full event data for external processing
gcal events show abc123 --format json --quiet > event-details.json
```

## Error Handling

Common errors and solutions:

- **Event not found**: Check the event ID and calendar
- **Access denied**: Ensure you have access to the specified calendar
- **Invalid event ID**: Verify the event ID format and source

## Related Commands

- [`gcal events list`](events-list.md) - Find event IDs to use with this command
- [`gcal calendars list`](calendars-list.md) - Find available calendar IDs
- [`gcal config`](config.md) - Configure default settings