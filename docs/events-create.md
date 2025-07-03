# gcal events create

Create a new calendar event with flexible scheduling options, attendees, and metadata.

## Usage

```bash
gcal events create <summary> [options]
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `summary` | Event title/summary | Yes |

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--start` | `-s` | Start date/time (ISO format) | Required |
| `--end` | `-e` | End date/time (ISO format) | - |
| `--duration` | `-d` | Duration in minutes (alternative to --end) | - |
| `--all-day` | | Create all-day event | `false` |
| `--calendar` | `-c` | Calendar ID to create event in | `primary` |
| `--location` | `-l` | Event location | - |
| `--description` | | Event description | - |
| `--attendees` | | Comma-separated list of attendee emails | - |
| `--send-updates` | | Send event invitations (all/externalOnly/none) | `none` |
| `--format` | `-f` | Output format (table, json, or pretty-json) | `table` |
| `--quiet` | `-q` | Suppress non-essential output (status messages, progress indicators) | `false` |

## Time Specification

### Timed Events
Use ISO 8601 format for date and time:
```bash
# Basic format
gcal events create "Meeting" --start "2024-01-15T14:00:00"

# With timezone
gcal events create "Call" --start "2024-01-15T14:00:00-08:00"
```

### All-Day Events
Use date-only format (YYYY-MM-DD):
```bash
gcal events create "Conference" --start "2024-01-15" --all-day
```

### Duration vs End Time
- Use `--duration` in minutes for convenience
- Use `--end` for specific end time
- Cannot specify both `--end` and `--duration`

## Examples

### Basic Event Creation

```bash
# Simple 1-hour meeting (default duration)
gcal events create "Team Meeting" --start "2024-01-15T14:00:00"

# Meeting with specific duration
gcal events create "Standup" --start "2024-01-15T09:00:00" --duration 30

# Meeting with specific end time
gcal events create "Project Review" --start "2024-01-15T14:00:00" --end "2024-01-15T16:00:00"
```

### All-Day Events

```bash
# Single day event
gcal events create "Conference" --start "2024-01-15" --all-day

# Multi-day event (end date is exclusive)
gcal events create "Vacation" --start "2024-01-15" --end "2024-01-20" --all-day
```

### Events with Metadata

```bash
# Meeting with location
gcal events create "Client Meeting" \
  --start "2024-01-15T14:00:00" \
  --duration 90 \
  --location "Conference Room A"

# Event with description
gcal events create "Sprint Planning" \
  --start "2024-01-15T10:00:00" \
  --duration 120 \
  --description "Plan tasks for next sprint"
```

### Events with Attendees

```bash
# Add attendees without sending invitations
gcal events create "Team Sync" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com"

# Send invitations to attendees
gcal events create "Important Meeting" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com" \
  --send-updates all
```

### Different Calendars

```bash
# Create in work calendar
gcal events create "Sprint Demo" \
  --start "2024-01-15T15:00:00" \
  --calendar work@company.com

# Create in personal calendar
gcal events create "Doctor Appointment" \
  --start "2024-01-15T10:00:00" \
  --calendar personal@gmail.com
```

### Advanced Examples

```bash
# Full meeting setup
gcal events create "Quarterly Review" \
  --start "2024-01-15T14:00:00" \
  --end "2024-01-15T17:00:00" \
  --location "Main Conference Room" \
  --description "Q4 results and Q1 planning" \
  --attendees "team@company.com,manager@company.com" \
  --calendar work@company.com \
  --send-updates all

# JSON output for scripting
gcal events create "Automated Event" \
  --start "2024-01-15T14:00:00" \
  --format json --quiet
```

## Output Formats

**Table Format (default):**
```
Event created successfully!

Title: Team Meeting
ID: abc123def456
Start: 1/15/2024, 2:00:00 PM
End: 1/15/2024, 3:00:00 PM
Location: Conference Room A
Google Calendar Link: https://calendar.google.com/event?eid=...
```

**JSON Format:**
```json
{
  "id": "abc123def456",
  "summary": "Team Meeting",
  "start": {
    "dateTime": "2024-01-15T14:00:00-08:00"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00-08:00"
  },
  "location": "Conference Room A",
  "htmlLink": "https://calendar.google.com/event?eid=..."
}
```

## Attendee Management

### Invitation Options
- `none` (default) - Add attendees but don't send invitations
- `all` - Send invitations to all attendees
- `externalOnly` - Send invitations only to external attendees

### Attendee Format
Provide email addresses separated by commas:
```bash
--attendees "alice@company.com,bob@external.com,charlie@company.com"
```

## Time Zone Handling

- **Local Time**: If no timezone specified, uses your local timezone
- **Explicit Timezone**: Include timezone offset in ISO format
- **All-Day Events**: Date-only format, timezone-independent

## Validation and Error Handling

### Common Errors
- **Invalid date format**: Ensure ISO 8601 format for timed events
- **Both end and duration**: Cannot specify both `--end` and `--duration`
- **Invalid duration**: Must be positive integer (minutes)
- **Past dates**: Warning shown but event still created

### Date Format Examples
```bash
# Valid formats
--start "2024-01-15T14:00:00"           # Local timezone
--start "2024-01-15T14:00:00-08:00"     # Pacific time
--start "2024-01-15T22:00:00Z"          # UTC
--start "2024-01-15" --all-day          # All-day event

# Invalid formats
--start "Jan 15, 2024"                  # Use ISO format
--start "14:00"                         # Missing date
```

## Use Cases

- **Meeting scheduling** - Create meetings with attendees and locations
- **Event planning** - Set up conferences, workshops, or social events
- **Personal reminders** - Create appointments and personal events
- **Recurring setup** - Create template events for manual repetition
- **Automation** - Script event creation from external systems

## Related Commands

- [`gcal events list`](events-list.md) - View created events
- [`gcal events show`](events-show.md) - Get detailed information about events
- [`gcal calendars list`](calendars-list.md) - Find available calendar IDs
- [`gcal config`](config.md) - Configure default settings