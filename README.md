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
gcal-commander/0.0.0 darwin-arm64 node-v18.20.8
$ gcal --help [COMMAND]
USAGE
  $ gcal COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gcal calendars list`](#gcal-calendars-list)
* [`gcal events list [CALENDAR]`](#gcal-events-list-calendar)
* [`gcal events show EVENTID`](#gcal-events-show-eventid)
* [`gcal help [COMMAND]`](#gcal-help-command)

## `gcal calendars list`

List all accessible Google calendars

```
USAGE
  $ gcal calendars list [--format json|table]

FLAGS
  --format=<option>  [default: table] Output format
                     <options: json|table>

DESCRIPTION
  List all accessible Google calendars

EXAMPLES
  $ gcal calendars list
  $ gcal calendars list --format json
```

## `gcal events list [CALENDAR]`

List upcoming events from Google Calendar

```
USAGE
  $ gcal events list [CALENDAR] [--format json|table] [--max-results <value>] [--days <value>]

ARGUMENTS
  CALENDAR  Calendar ID (default: primary calendar)

FLAGS
  --days=<value>         [default: 30] Number of days to look ahead
  --format=<option>      [default: table] Output format
                         <options: json|table>
  --max-results=<value>  [default: 10] Maximum number of events to return

DESCRIPTION
  List upcoming events from Google Calendar

EXAMPLES
  $ gcal events list
  $ gcal events list --max-results 5 --days 7
  $ gcal events list my-calendar@gmail.com --format json
```

## `gcal events show EVENTID`

Show detailed information about a specific event

```
USAGE
  $ gcal events show EVENTID [--format json|table]

ARGUMENTS
  EVENTID  Event ID to display

FLAGS
  --format=<option>  [default: table] Output format
                     <options: json|table>

DESCRIPTION
  Show detailed information about a specific event

EXAMPLES
  $ gcal events show abc123def456
  $ gcal events show abc123def456 --format json
```

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
