gcal-commander
=================

A command-line interface for Google Calendar operations. Manage your Google Calendar events and calendars directly from the terminal.

> 🤖 This project is primarily developed using [Claude Code](https://claude.ai/code), demonstrating AI-assisted development capabilities.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)


## Features

- 📅 **Read Google Calendar events** - List and view detailed event information
- 📋 **Manage multiple calendars** - Access all your Google calendars
- 🔐 **Secure OAuth2 authentication** - One-time setup with automatic token refresh
- 💻 **Terminal-friendly output** - Clean table format or JSON for scripting
- 🔇 **Quiet mode support** - Use `--quiet` flag to suppress status messages for scripting
- 🚀 **Fast and lightweight** - Built with oclif framework

## Installation

```bash
npm install -g gcal-commander
```

## Initial Setup

Before using gcal-commander, you need to set up Google Calendar API access:

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields (Application name, User support email, Developer contact)
   - Add your email to test users
4. For Application type, select "Desktop application"
5. Give it a name (e.g., "gcal-commander")
6. Click "Create"
7. Download the credentials JSON file

### 3. Setup Credentials File

Place the downloaded credentials file in the gcal-commander config directory:

```bash
# Create the config directory
mkdir -p ~/.gcal-commander

# Copy your downloaded credentials file
cp ~/Downloads/client_secret_*.json ~/.gcal-commander/credentials.json
```

### 4. First Run Authentication

When you run gcal-commander for the first time, it will:

1. Open your default browser for Google OAuth authentication
2. Ask you to sign in to your Google account
3. Request permission to access your Google Calendar (read-only)
4. Save the authentication token automatically

```bash
# First run - this will trigger the authentication flow
gcal calendars list
```

The authentication token will be saved to `~/.gcal-commander/token.json` and automatically refreshed when needed.

## Configuration

gcal-commander supports global configuration to customize default behavior:

```bash
# Set default calendar for events list
gcal config set defaultCalendar work@company.com

# Set default number of events to display
gcal config set events.maxResults 25

# Set default output format
gcal config set events.format json

# Set default time range (days)
gcal config set events.days 60

# View all current configuration
gcal config list

# View specific configuration value
gcal config get defaultCalendar

# Remove a configuration setting
gcal config unset defaultCalendar

# Reset all configuration
gcal config reset --confirm
```

### Configuration Options

- `defaultCalendar` - Default calendar ID for `gcal events list` (defaults to "primary")
- `events.maxResults` - Default maximum number of events (1-100, defaults to 10)
- `events.format` - Default output format: "table" or "json" (defaults to "table")
- `events.days` - Default number of days to look ahead (1-365, defaults to 30)

Configuration is stored in `~/.gcal-commander/config.json` and can be edited manually.

### Basic Usage

```bash
# List all your calendars
gcal calendars list

# List upcoming events from your primary calendar
gcal events list

# List events from a specific calendar
gcal events list my-calendar@gmail.com

# Show detailed information about an event
gcal events show <event-id>

# Limit number of events and time range
gcal events list --max-results 5 --days 7

# Use quiet mode for scripting (suppresses status messages)
gcal events list --quiet --format json | jq '.[] | .summary'

# Configuration examples
gcal config set defaultCalendar work@company.com
gcal events list  # Now uses work@company.com as default
```

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g gcal-commander
$ gcal COMMAND
running command...
$ gcal (--version)
gcal-commander/0.0.0-development darwin-arm64 node-v22.16.0
$ gcal --help [COMMAND]
USAGE
  $ gcal COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gcal calendars list`](#gcal-calendars-list)
* [`gcal config [KEY] SUBCOMMAND [VALUE]`](#gcal-config-key-subcommand-value)
* [`gcal events list [CALENDAR]`](#gcal-events-list-calendar)
* [`gcal events show EVENTID`](#gcal-events-show-eventid)
* [`gcal help [COMMAND]`](#gcal-help-command)

## `gcal calendars list`

List all available calendars

```
USAGE
  $ gcal calendars list [-f table|json]

FLAGS
  -f, --format=<option>  [default: table] Output format
                         <options: table|json>

DESCRIPTION
  List all available calendars

EXAMPLES
  $ gcal calendars list

  $ gcal calendars list --format json
```

_See code: [src/commands/calendars/list.ts](https://github.com/buko106/gcal-commander/blob/v0.0.0-development/src/commands/calendars/list.ts)_

## `gcal config [KEY] SUBCOMMAND [VALUE]`

Manage global configuration settings

```
USAGE
  $ gcal config [KEY] SUBCOMMAND [VALUE] [--confirm] [-f table|json]

ARGUMENTS
  KEY         Configuration key
  SUBCOMMAND  (get|set|list|unset|reset) Config subcommand
  VALUE       Configuration value

FLAGS
  -f, --format=<option>  [default: table] Output format
                         <options: table|json>
      --confirm          Skip confirmation prompt for reset

DESCRIPTION
  Manage global configuration settings

EXAMPLES
  $ gcal config set defaultCalendar my-work@gmail.com

  $ gcal config get defaultCalendar

  $ gcal config list

  $ gcal config unset defaultCalendar

  $ gcal config reset
```

_See code: [src/commands/config.ts](https://github.com/buko106/gcal-commander/blob/v0.0.0-development/src/commands/config.ts)_

## `gcal events list [CALENDAR]`

List upcoming calendar events

```
USAGE
  $ gcal events list [CALENDAR] [-d <value>] [-f table|json] [-n <value>]

ARGUMENTS
  CALENDAR  [default: primary] Calendar ID to list events from

FLAGS
  -d, --days=<value>         [default: 30] Number of days to look ahead
  -f, --format=<option>      [default: table] Output format
                             <options: table|json>
  -n, --max-results=<value>  [default: 10] Maximum number of events to return

DESCRIPTION
  List upcoming calendar events

EXAMPLES
  $ gcal events list

  $ gcal events list my-calendar@gmail.com

  $ gcal events list --max-results 20

  $ gcal events list --days 7
```

_See code: [src/commands/events/list.ts](https://github.com/buko106/gcal-commander/blob/v0.0.0-development/src/commands/events/list.ts)_

## `gcal events show EVENTID`

Show detailed information about a specific event

```
USAGE
  $ gcal events show EVENTID [-c <value>] [-f table|json]

ARGUMENTS
  EVENTID  Event ID to show details for

FLAGS
  -c, --calendar=<value>  [default: primary] Calendar ID where the event is located
  -f, --format=<option>   [default: table] Output format
                          <options: table|json>

DESCRIPTION
  Show detailed information about a specific event

EXAMPLES
  $ gcal events show event123

  $ gcal events show event123 --calendar my-calendar@gmail.com

  $ gcal events show event123 --format json
```

_See code: [src/commands/events/show.ts](https://github.com/buko106/gcal-commander/blob/v0.0.0-development/src/commands/events/show.ts)_

## `gcal help [COMMAND]`

Display help for gcal.

```
USAGE
  $ gcal help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for gcal.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.29/src/commands/help.ts)_
<!-- commandsstop -->

## Contributing

We welcome contributions to gcal-commander! This project embraces AI-assisted development.

### Recommended Development Workflow

- **Use [Claude Code](https://claude.ai/code)** for development assistance - from implementing features to code reviews
- **Quality Assurance**: Have Claude Code review your changes for code quality, best practices, and consistency
- **Testing**: Ensure all tests pass with `npm test`
- **Linting**: Code is automatically linted and formatted via pre-commit hooks

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

The project uses Husky + lint-staged for automatic code quality checks before commits.
