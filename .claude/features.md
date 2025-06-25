# Features and Specifications

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
│   ├── base-command.ts # Base command class with --quiet flag support
│   └── index.ts       # Main entry point
├── test/               # Test files (mirrors src/ structure)
│   ├── commands/      # Command tests
│   │   ├── config.test.ts # Config command tests
│   │   └── quiet.test.ts  # --quiet flag behavior tests
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

## Google Calendar Integration

- **Authentication**: OAuth2 flow with automatic token refresh
- **Credentials**: Stored in `~/.gcal-commander/credentials.json`
- **Tokens**: Auto-saved to `~/.gcal-commander/token.json`
- **Configuration**: User settings stored in `~/.gcal-commander/config.json`
- **Scopes**: Currently read-only (`https://www.googleapis.com/auth/calendar.readonly`)
- **API**: Uses Google Calendar API v3 via `googleapis` library

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

### Global Command Options
- `--quiet, -q` - Suppress non-essential output (status messages, progress indicators)
- `--format json|table` - Output format (overrides config)
- `--max-results N` - Maximum events to return (overrides config)
- `--days N` - Number of days to look ahead (overrides config)

## Development Guidelines

- **Repository Structure Updates**: When adding/removing directories or files, always update the Repository Structure section in this file to keep it current
- **README Updates**: When adding new commands or changing command options, always update the README.md file with usage examples and documentation
- **Architecture Updates**: When making significant architectural changes (new services, major feature additions), update the Architecture section in .claude/core.md

### Test-Driven Development

For comprehensive TDD practices and methodology, see `.claude/tdd.md` which covers:
- Red-Green-Refactor cycle with todo list management
- Step-by-step testing process and CLI-specific patterns
- Testing granularity and refactoring safety practices

## Problem-Solving Methodology

### Solution Evaluation Framework

When facing implementation decisions, systematically evaluate options:

#### 1. **Research Phase**
- **Framework Documentation**: Check if oclif provides built-in solutions
- **Existing Patterns**: Search codebase for similar implementations
- **Community Standards**: Research Unix CLI conventions and best practices
- **External Libraries**: Evaluate if external dependencies are necessary

#### 2. **Solution Comparison**
Document and compare multiple approaches:

**Example: Logging Implementation Options**
1. **Custom Logger Class** ❌
   - Pros: Full control, custom features
   - Cons: Reinventing wheel, maintenance burden, not oclif-integrated
   
2. **Console Methods** ❌  
   - Pros: Simple, direct
   - Cons: No JSON mode integration, manual stderr routing
   
3. **oclif Built-in Methods** ✅
   - Pros: Framework integration, automatic JSON handling, standard behavior
   - Cons: Must learn framework APIs
   - Winner: Leverages existing, tested functionality

#### 3. **Decision Criteria**
Prioritize solutions that:
- **Leverage framework capabilities** rather than fighting them
- **Follow established conventions** (Unix CLI patterns)
- **Minimize custom code** and maintenance burden
- **Integrate well** with existing architecture
- **Support testing** and verification

#### 4. **Implementation Strategy**
- **Start small**: Prototype with minimal viable implementation
- **Test early**: Verify behavior matches expectations
- **Document findings**: Update relevant .claude/ files with learnings
- **Refactor safely**: Use tests to ensure no regressions

### Common Anti-Patterns to Avoid

- **Not checking framework capabilities first** - Always research before building
- **Mixing stdout/stderr inappropriately** - Breaks piping and Unix conventions
- **Custom implementations of standard features** - Increases maintenance burden
- **Skipping comparative analysis** - May choose suboptimal approach
- **Large, untested changes** - Makes debugging and verification difficult

This methodology ensures well-informed technical decisions and maintainable solutions.