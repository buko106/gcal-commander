# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `gcal-commander`, a Google Calendar CLI tool built with the oclif framework. Provides read-only access to Google Calendar events and calendars via command-line interface with OAuth2 authentication.

## Development Commands

- `npm run build` - Build TypeScript to dist/ directory
- `npm run test` - Run Mocha tests with pattern "test/**/*.test.ts"  
- `npm run lint` - Run ESLint
- `npm run posttest` - Automatically runs lint after tests
- `./bin/run.js COMMAND` or `gcal COMMAND` - Run CLI commands locally

## Release Process

This project uses **semantic-release** for fully automated releases based on conventional commits:

### 🔄 Complete Release Flow

1. **Development & Commits**
   ```bash
   git commit -m "feat: add new calendar filtering feature"
   git commit -m "fix: resolve timezone display issue"
   git commit -m "docs: update installation guide"
   git push
   ```

2. **Automatic Release** (triggered by push to main)
   - GitHub Actions runs tests first (`test` job)
   - If tests pass, `release` job runs semantic-release:
     ```
     npm ci → npm run build → npx semantic-release
     ```
   - Automatically determines version based on commit messages
   - Generates CHANGELOG.md from commit history
   - Creates GitHub Release with release notes
   - Creates Git tag (e.g., `v1.0.0`)
   - Publishes package to npm registry

### 🛠️ Technical Configuration

**GitHub Actions Workflow** (`.github/workflows/release.yml`):
- **Triggers**: `push` to main, `pull_request` for testing
- **Two-stage pipeline**: `test` → `release` (release only on main push)
- **Authentication**: GitHub Token (automatic) + NPM Token (secrets)
- **Registry**: `registry-url: 'https://registry.npmjs.org/'`

**semantic-release Configuration** (`.releaserc.json`):
```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github"
  ]
}
```

**Version Management**:
- `feat:` → Minor version bump (0.1.0 → 0.2.0)
- `fix:` → Patch version bump (0.1.0 → 0.1.1)
- `BREAKING CHANGE:` → Major version bump (0.1.0 → 1.0.0)
- `docs:`, `style:`, `refactor:`, `test:` → No version bump (until next feat/fix)

### 🔧 Manual Release (Emergency Use)
```bash
# Only for emergency releases or workflow bypass
npx semantic-release --dry-run  # Preview what would be released
npx semantic-release --no-ci    # Force release locally (not recommended)

# Check release status
npm view gcal-commander versions --json
```

### 📋 Required Secrets
- **NPM_TOKEN**: Set in GitHub Settings → Secrets → Actions
  - Use Granular Access Token for security
  - Grant `Read and write` access to `gcal-commander` package

## Pre-commit Hooks

The project uses **Husky + lint-staged** for automatic code quality checks before commits:

- **ESLint**: Automatically fixes linting issues on staged `.ts` and `.js` files
- **Prettier**: Formats staged code files (`.ts`, `.js`, `.json`, `.md`)
- **Automatic setup**: Hooks are installed via `npm run prepare` (runs automatically on `npm install`)

### Configuration
- **Husky**: Pre-commit hook in `.husky/pre-commit`
- **lint-staged**: Configuration in `lint-staged.config.js` (moved from package.json for extensibility)
- **Prettier**: Installed as dev dependency for code formatting
- **Supported files**: TypeScript/JavaScript (lint + format), JSON/Markdown (format only)

## Repository Structure

```
gcal-commander/
├── .github/              # GitHub Actions workflows
│   └── workflows/
│       └── release.yml   # Automated release workflow
├── bin/                  # CLI executable entry point
├── src/                  # TypeScript source code
│   ├── commands/        # CLI command implementations
│   │   ├── calendars/   # Calendar-related commands
│   │   │   └── list.ts # List calendars command
│   │   ├── events/     # Event-related commands
│   │   │   ├── list.ts # List events command (supports config defaults)
│   │   │   └── show.ts # Show event details command
│   │   ├── config.ts   # Configuration management command
│   │   └── hello/      # Example commands (can be removed)
│   ├── services/       # Business logic services
│   │   ├── calendar.ts # Google Calendar API wrapper
│   │   └── config.ts   # Configuration service
│   ├── auth.ts        # OAuth2 authentication handling
│   └── index.ts       # Main entry point
├── test/               # Test files (mirrors src/ structure)
│   ├── commands/      # Command tests
│   │   └── config.test.ts # Config command tests
│   ├── services/      # Service tests
│   └── tsconfig.json # Test-specific TypeScript config
├── dist/              # Compiled JavaScript output (generated)
├── .husky/           # Git hooks (husky)
├── .releaserc.json     # semantic-release configuration
├── lint-staged.config.js # lint-staged configuration
├── package.json       # Project configuration and dependencies
├── tsconfig.json     # TypeScript configuration
├── eslint.config.mjs # ESLint configuration
└── CLAUDE.md         # This file
```

## Architecture

Built on oclif CLI framework:
- **Commands**: Located in `src/commands/` with nested structure:
  - `events/list.ts` - List calendar events (supports config defaults)
  - `events/show.ts` - Show event details
  - `calendars/list.ts` - List available calendars
  - `config.ts` - Manage global configuration settings
- **Authentication**: `src/auth.ts` handles OAuth2 flow with Google Calendar API
- **Services**: 
  - `src/services/calendar.ts` wraps Google Calendar API calls
  - `src/services/config.ts` manages user configuration in JSON format
- **Tests**: Mirror command structure in `test/commands/` using Mocha and Chai
- **CLI Entry**: `bin/run.js` points to built commands in `dist/commands/`
- **Configuration**: oclif config in package.json defines bin name "gcal", command discovery, and topics

## Google Calendar Integration

- **Authentication**: OAuth2 flow with automatic token refresh
- **Credentials**: Stored in `~/.gcal-commander/credentials.json`
- **Tokens**: Auto-saved to `~/.gcal-commander/token.json`
- **Configuration**: User settings stored in `~/.gcal-commander/config.json`
- **Scopes**: Currently read-only (`https://www.googleapis.com/auth/calendar.readonly`)
- **API**: Uses Google Calendar API v3 via `googleapis` library

## Command Structure

Commands extend oclif's `Command` class with:
- Static `args` and `flags` for CLI arguments
- Static `description` and `examples` for help text
- `async run()` method for command logic
- Use `this.log()` for output and `this.parse()` for argument parsing

## Testing

Uses `@oclif/test` with `runCommand()` helper to test CLI commands end-to-end. Tests verify command output using Chai expectations.

## Current Features (v0.1.0)

### Available Commands
- `gcal calendars list` - List all accessible Google calendars
- `gcal events list [calendar]` - List upcoming events (default: configurable)
- `gcal events show <eventId>` - Show detailed event information
- `gcal config <subcommand>` - Manage global configuration settings

### Configuration Management
- `gcal config set <key> <value>` - Set configuration value
- `gcal config get <key>` - Get configuration value
- `gcal config list` - List all configuration
- `gcal config unset <key>` - Remove configuration value
- `gcal config reset --confirm` - Reset all configuration

### Configurable Settings
- `defaultCalendar` - Default calendar for events list (default: "primary")
- `events.maxResults` - Default maximum events (1-100, default: 10)
- `events.format` - Default output format ("table"|"json", default: "table")
- `events.days` - Default days ahead (1-365, default: 30)

### Command Options
- `--format json|table` - Output format (overrides config)
- `--max-results N` - Maximum events to return (overrides config)
- `--days N` - Number of days to look ahead (overrides config)

## Setup Requirements

Before using the CLI, users need:
1. Google Cloud Console project with Calendar API enabled
2. OAuth2 desktop application credentials
3. Credentials file placed at `~/.gcal-commander/credentials.json`

## Git Conventions

- All commit messages should be written in English
- Follow conventional commit format when possible

## Development Guidelines

- **Repository Structure Updates**: When adding/removing directories or files, always update the Repository Structure section in this CLAUDE.md file to keep it current
- **README Updates**: When adding new commands or changing command options, always update the README.md file with usage examples and documentation
- **Architecture Updates**: When making significant architectural changes (new services, major feature additions), update the Architecture section in this CLAUDE.md file