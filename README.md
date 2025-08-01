gcal-commander
=================

A command-line interface for Google Calendar operations. Manage your Google Calendar events and calendars directly from the terminal.

> 🤖 This project is primarily developed using [Claude Code](https://claude.ai/code), demonstrating AI-assisted development capabilities.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![codecov](https://codecov.io/github/buko106/gcal-commander/graph/badge.svg?token=DQUL68E057)](https://codecov.io/github/buko106/gcal-commander)

## Features

- 📅 **Read Google Calendar events** - List and view detailed event information
- ✏️ **Create calendar events** - Add new events with flexible time options, attendees, and locations
- 📋 **Manage multiple calendars** - Access all your Google calendars
- 🔐 **Secure OAuth2 authentication** - One-time setup with automatic token refresh
- 💻 **Terminal-friendly output** - Clean table format or JSON for scripting
- 🔇 **Quiet mode support** - Use `--quiet` flag to suppress status messages for scripting
- 🎯 **Customizable table columns** - Use `--fields` flag to show only specific columns in table format
- 🚀 **Fast and lightweight** - Built with oclif framework

## Languages

📖 **README in other languages:**
- [🇯🇵 日本語 (Japanese)](docs/ja/README.md)
- [🇪🇸 Español (Spanish)](docs/es/README.md)
- [🇩🇪 Deutsch (German)](docs/de/README.md)
- [🇵🇹 Português (Portuguese)](docs/pt/README.md)
- [🇫🇷 Français (French)](docs/fr/README.md)
- [🇰🇷 한국어 (Korean)](docs/ko/README.md)

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
3. Request permission to access your Google Calendar
4. Save the authentication token automatically

```bash
# First run - this will trigger the authentication flow
gcal calendars list
```

The authentication token will be saved to `~/.gcal-commander/token.json` and automatically refreshed when needed.

## Basic Usage

```bash
# List all your calendars
gcal calendars list

# List upcoming events from your primary calendar
gcal events list

# List events from a specific calendar
gcal events list my-calendar@gmail.com

# Show detailed information about an event
gcal events show <event-id>

# Create a new event
gcal events create "Team Meeting" --start "2024-01-15T14:00:00" --duration 60

# Create an all-day event
gcal events create "Conference" --start "2024-01-15" --all-day

# Create an event with attendees and description
gcal events create "Project Review" --start "2024-01-15T10:00:00" --duration 90 \
  --attendees "team@company.com,manager@company.com" \
  --description "Quarterly project review meeting" \
  --location "Conference Room A" \
  --send-updates all

# Limit number of events and time range
gcal events list --max-results 5 --days 7

# Use quiet mode for scripting (suppresses status messages, keeps data output)
gcal events list --quiet --format json | jq '.[] | .summary'

# Customize table columns using --fields flag
gcal events list --fields title,date,time
gcal calendars list --fields name,id

# Configuration examples
gcal config set defaultCalendar work@company.com
gcal events list  # Now uses work@company.com as default
```

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

# Set interface language (supports: en, ja, es, de, pt, fr, ko)
gcal config set language ja

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
- `events.format` - Default output format: "table", "json", or "pretty-json" (defaults to "table")
- `events.days` - Default number of days to look ahead (1-365, defaults to 30)
- `language` - Interface language: "en", "ja", "es", "de", "pt", "fr", or "ko" (defaults to "en")

Configuration is stored in `~/.gcal-commander/config.json` and can be edited manually.

## Commands

gcal-commander provides several commands to interact with Google Calendar:

### Calendar Management
- **[`gcal calendars list`](docs/calendars-list.md)** - List all available calendars

### Event Management  
- **[`gcal events list`](docs/events-list.md)** - List upcoming calendar events with configuration defaults support
- **[`gcal events show`](docs/events-show.md)** - Show detailed event information
- **[`gcal events create`](docs/events-create.md)** - Create new calendar events with attendees, descriptions, and notification options

### Configuration
- **[`gcal config`](docs/config.md)** - Manage global configuration settings

### Setup & Authentication
- **[`gcal init`](docs/init.md)** - Interactive setup with language selection and authentication verification

### Help
- **`gcal help`** - Display help for any command

For detailed usage examples and options for each command, click on the links above to view the comprehensive documentation.

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
3. **Development workflow**:
   - **For active development**: Use `./bin/dev.js COMMAND` to run commands directly from TypeScript source files (no build required)
   - **For final testing**: Use `npm run build && ./bin/run.js COMMAND` to test the production build
4. Make your changes and run tests: `npm test`
5. Submit a pull request

**CLI Execution Modes:**
- `./bin/dev.js` - Development mode (TypeScript source files with ts-node, instant changes)
- `./bin/run.js` - Production mode (compiled JavaScript from dist/, requires build)

The project uses Husky + lint-staged for automatic code quality checks before commits.

## Language Support

gcal-commander supports internationalization (i18n) and is available in multiple languages:

**Supported Languages:**
- **English** (`en`) - Default
- **Japanese** (`ja`) - 日本語  
- **Spanish** (`es`) - Español
- **German** (`de`) - Deutsch
- **Portuguese** (`pt`) - Português
- **French** (`fr`) - Français
- **Korean** (`ko`) - 한국어

```bash
# Switch to Japanese
gcal config set language ja

# Switch to Spanish
gcal config set language es

# Switch to German
gcal config set language de

# Switch to Portuguese
gcal config set language pt

# Switch to French
gcal config set language fr

# Switch to Korean
gcal config set language ko

# Switch back to English  
gcal config set language en

# View current language setting
gcal config get language
```

All command output messages, error messages, and status messages will be displayed in the selected language.
