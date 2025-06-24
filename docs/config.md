# gcal config

Manage global configuration settings for gcal-commander. Configure default values for commands to customize your experience.

## Usage

```bash
gcal config <subcommand> [key] [value] [options]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `get <key>` | Get a configuration value |
| `set <key> <value>` | Set a configuration value |
| `list` | List all configuration settings |
| `unset <key>` | Remove a configuration setting |
| `reset` | Reset all configuration to defaults |

## Options

| Flag | Description |
|------|-------------|
| `--format` | Output format for list/get (table or json) |
| `--confirm` | Skip confirmation prompt for reset |
| `--quiet` | Suppress status messages |

## Configuration Keys

### Core Settings

| Key | Description | Default | Valid Values |
|-----|-------------|---------|--------------|
| `defaultCalendar` | Default calendar for events list | `primary` | Any calendar ID |

### Events Command Defaults

| Key | Description | Default | Valid Values |
|-----|-------------|---------|--------------|
| `events.maxResults` | Default maximum events to return | `10` | `1-100` |
| `events.format` | Default output format | `table` | `table`, `json` |
| `events.days` | Default days to look ahead | `30` | `1-365` |

## Examples

### Basic Configuration

```bash
# Set default calendar
gcal config set defaultCalendar work@company.com

# Get current default calendar
gcal config get defaultCalendar

# List all current settings
gcal config list

# Remove a setting (reverts to default)
gcal config unset defaultCalendar
```

### Events Command Defaults

```bash
# Set default number of events to show
gcal config set events.maxResults 25

# Set default time range
gcal config set events.days 60

# Set default output format
gcal config set events.format json

# View events settings
gcal config get events.maxResults
gcal config get events.days
gcal config get events.format
```

### Configuration Management

```bash
# View all settings in table format
gcal config list

# View all settings in JSON format
gcal config list --format json

# Reset all configuration (with confirmation)
gcal config reset

# Reset all configuration (skip confirmation)
gcal config reset --confirm
```

## Output Formats

### List Command - Table Format (default)
```
Key                 Value
─────────────────────────────────────
defaultCalendar     work@company.com
events.maxResults   25
events.format       json
events.days         60
```

### List Command - JSON Format
```json
{
  "defaultCalendar": "work@company.com",
  "events": {
    "maxResults": 25,
    "format": "json",
    "days": 60
  }
}
```

### Get Command
```bash
$ gcal config get defaultCalendar
work@company.com
```

## Configuration File

Configuration is stored in `~/.gcal-commander/config.json`:

```json
{
  "defaultCalendar": "work@company.com",
  "events": {
    "maxResults": 25,
    "format": "table",
    "days": 60
  }
}
```

You can edit this file manually if needed, but using the config commands is recommended.

## Common Workflows

### Setting Up Work Environment
```bash
# Configure for work usage
gcal config set defaultCalendar work@company.com
gcal config set events.maxResults 20
gcal config set events.days 14
gcal config set events.format table
```

### Setting Up Scripting Environment
```bash
# Configure for automation/scripting
gcal config set events.format json
gcal config set events.maxResults 100
```

### Multiple Calendar Management
```bash
# Set primary work calendar
gcal config set defaultCalendar primary-work@company.com

# Events list will now default to this calendar
gcal events list  # Uses primary-work@company.com

# Override for specific queries
gcal events list personal@gmail.com
```

## Validation

Configuration values are validated when set:

- **Calendar IDs**: Not validated until first use
- **Numeric ranges**: `maxResults` (1-100), `days` (1-365)
- **Enums**: `format` must be "table" or "json"
- **Invalid values**: Command will show error and current valid options

## Impact on Commands

Configuration affects default behavior of commands:

### [`gcal events list`](events-list.md)
- Uses `defaultCalendar` when no calendar specified
- Uses `events.maxResults` for `--max-results` default
- Uses `events.format` for `--format` default  
- Uses `events.days` for `--days` default

### [`gcal events show`](events-show.md)
- Uses `defaultCalendar` for `--calendar` default when not specified

Command-line flags always override configuration defaults.

## Troubleshooting

### Reset Configuration
If you have issues with your configuration:
```bash
gcal config reset --confirm
```

### View Current Settings
```bash
gcal config list --format json
```

### Check Specific Setting
```bash
gcal config get defaultCalendar
```

## Related Commands

- [`gcal events list`](events-list.md) - Uses configuration defaults
- [`gcal events show`](events-show.md) - Uses configuration defaults
- [`gcal calendars list`](calendars-list.md) - Find calendar IDs for configuration