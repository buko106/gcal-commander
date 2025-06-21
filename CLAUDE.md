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

This project uses **simple-release-action** for automated releases:

### How It Works
1. **Development**: Make commits using conventional commit format (`feat:`, `fix:`, `docs:`, etc.)
2. **Automatic PR**: When releasable changes are pushed to main, a release PR is automatically created
3. **Review & Merge**: Review the generated CHANGELOG.md and version bump, then merge the PR
4. **Automatic Release**: Upon merge, the package is automatically published to npm and a GitHub release is created

### Configuration
- **simple-release-action**: Configured via `.simple-release.json`
- **GitHub Actions**: Workflow defined in `.github/workflows/release.yml`
- **Conventional Commits**: Used for automatic version determination and changelog generation

### Manual Release (if needed)
```bash
# Force a specific version (emergency use only)
npm version 1.0.0
git push --tags
```

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
│   │   │   ├── list.ts # List events command
│   │   │   └── show.ts # Show event details command
│   │   └── hello/      # Example commands (can be removed)
│   ├── services/       # Business logic services
│   │   └── calendar.ts # Google Calendar API wrapper
│   ├── auth.ts        # OAuth2 authentication handling
│   └── index.ts       # Main entry point
├── test/               # Test files (mirrors src/ structure)
│   ├── commands/      # Command tests
│   ├── services/      # Service tests
│   └── tsconfig.json # Test-specific TypeScript config
├── dist/              # Compiled JavaScript output (generated)
├── .husky/           # Git hooks (husky)
├── .simple-release.json # simple-release-action configuration
├── lint-staged.config.js # lint-staged configuration
├── package.json       # Project configuration and dependencies
├── tsconfig.json     # TypeScript configuration
├── eslint.config.mjs # ESLint configuration
└── CLAUDE.md         # This file
```

## Architecture

Built on oclif CLI framework:
- **Commands**: Located in `src/commands/` with nested structure:
  - `events/list.ts` - List calendar events
  - `events/show.ts` - Show event details
  - `calendars/list.ts` - List available calendars
- **Authentication**: `src/auth.ts` handles OAuth2 flow with Google Calendar API
- **Services**: `src/services/calendar.ts` wraps Google Calendar API calls
- **Tests**: Mirror command structure in `test/commands/` using Mocha and Chai
- **CLI Entry**: `bin/run.js` points to built commands in `dist/commands/`
- **Configuration**: oclif config in package.json defines bin name "gcal", command discovery, and topics

## Google Calendar Integration

- **Authentication**: OAuth2 flow with automatic token refresh
- **Credentials**: Stored in `~/.gcal-commander/credentials.json`
- **Tokens**: Auto-saved to `~/.gcal-commander/token.json`
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
- `gcal events list [calendar]` - List upcoming events (default: primary calendar)
- `gcal events show <eventId>` - Show detailed event information

### Command Options
- `--format json|table` - Output format (default: table)
- `--max-results N` - Maximum events to return (default: 10)
- `--days N` - Number of days to look ahead (default: 30)

## Setup Requirements

Before using the CLI, users need:
1. Google Cloud Console project with Calendar API enabled
2. OAuth2 desktop application credentials
3. Credentials file placed at `~/.gcal-commander/credentials.json`

## Git Conventions

- All commit messages should be written in English
- Follow conventional commit format when possible

## Important Notes

- **Repository Structure Updates**: When adding/removing directories or files, always update the Repository Structure section in this CLAUDE.md file to keep it current