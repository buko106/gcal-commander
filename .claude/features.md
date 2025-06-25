# Features and Specifications

## Repository Structure

> **⚠️ MAINTENANCE REQUIREMENT**: This structure must be updated whenever directories or files are added/removed/moved. When making structural changes, always update this section to reflect the current state.

```
gcal-commander/
├── .claude/                    # Claude Code documentation and settings
│   ├── core.md                # Core architecture and patterns
│   ├── features.md            # This file - features and specifications
│   ├── processes.md           # Release workflow and processes
│   ├── settings.local.json    # Local Claude Code settings
│   └── tdd.md                 # Test-driven development practices
├── .github/                   # GitHub Actions workflows
│   └── workflows/             # CI/CD automation
├── .husky/                    # Git hooks configuration (husky)
│   └── _/                     # Husky internal files
├── .vscode/                   # VS Code workspace settings
│   └── launch.json           # Debug configuration
├── bin/                       # CLI executable entry points
│   ├── dev.js               # Development entry point
│   └── run.js               # Production entry point
├── docs/                      # Command documentation
│   ├── calendars-list.md     # gcal calendars list documentation
│   ├── config.md             # gcal config documentation
│   ├── events-list.md        # gcal events list documentation
│   └── events-show.md        # gcal events show documentation
├── src/                       # TypeScript source code
│   ├── commands/             # CLI command implementations
│   │   ├── calendars/        # Calendar-related commands
│   │   │   └── list.ts      # List calendars command
│   │   ├── events/          # Event-related commands
│   │   │   ├── create.ts    # Create new event command (full feature implementation)
│   │   │   ├── list.ts      # List events command (supports config defaults)
│   │   │   └── show.ts      # Show event details command
│   │   ├── config.ts        # Configuration management command
│   │   └── hello/           # Example commands (legacy, can be removed)
│   │       ├── index.ts     # Hello command
│   │       └── world.ts     # Hello world subcommand
│   ├── interfaces/          # TypeScript interfaces
│   │   └── services.ts      # Service interface definitions
│   ├── services/            # Business logic services
│   │   ├── auth.ts          # Authentication service
│   │   ├── calendar.ts      # Google Calendar API wrapper
│   │   ├── config.ts        # Configuration service
│   │   └── service-registry.ts # Service dependency injection
│   ├── test-utils/          # Testing utilities
│   │   └── mock-services.ts # Mock service implementations
│   ├── utils/               # Utility functions
│   ├── auth.ts              # OAuth2 authentication handling (legacy)
│   ├── base-command.ts      # Base command class with --quiet flag support
│   └── index.ts             # Main entry point
├── test/                      # Test files (mirrors src/ structure)
│   ├── commands/             # Command tests
│   │   ├── calendars/       # Calendar command tests
│   │   │   ├── list.integration.test.ts # Integration tests
│   │   │   ├── list.output.test.ts      # Output format tests
│   │   │   └── list.test.ts             # Unit tests
│   │   ├── events/          # Event command tests
│   │   │   ├── create.test.ts           # Create command tests
│   │   │   ├── list.integration.test.ts # Integration tests
│   │   │   ├── list.test.ts             # Unit tests
│   │   │   ├── show.output.test.ts      # Show command output tests
│   │   │   └── show.test.ts             # Show command tests
│   │   ├── hello/           # Hello command tests (legacy)
│   │   │   ├── index.test.ts
│   │   │   └── world.test.ts
│   │   ├── config.test.ts   # Config command tests
│   │   └── quiet.test.ts    # --quiet flag behavior tests
│   ├── services/            # Service tests
│   │   └── calendar.test.ts # Calendar service tests
│   ├── test-data/           # Test data fixtures
│   │   └── calendar-test-data.ts # Calendar API response fixtures
│   ├── test-helpers/        # Test helper functions
│   │   └── calendar-test-helpers.ts # Calendar testing utilities
│   ├── utils/               # Utility test helpers
│   └── tsconfig.json       # Test-specific TypeScript config
├── dist/                      # Compiled JavaScript output (generated, gitignored)
├── node_modules/             # Dependencies (generated, gitignored)
├── .mocharc.json             # Mocha test configuration
├── .prettierrc.json          # Prettier formatting configuration
├── .releaserc.json           # semantic-release configuration
├── CHANGELOG.md              # Auto-generated changelog
├── CLAUDE.md                 # Claude Code project instructions
├── LICENSE                   # MIT license
├── README.md                 # Project documentation and usage guide
├── eslint.config.mjs         # ESLint configuration
├── lint-staged.config.js     # lint-staged configuration
├── package-lock.json         # NPM dependency lock file
├── package.json              # Project configuration and dependencies
├── tsconfig.json             # TypeScript configuration
└── tsconfig.tsbuildinfo      # TypeScript build cache (generated)
```

## Google Calendar Integration

- **Authentication**: OAuth2 flow with automatic token refresh
- **Credentials**: Stored in `~/.gcal-commander/credentials.json`
- **Tokens**: Auto-saved to `~/.gcal-commander/token.json`
- **Configuration**: User settings stored in `~/.gcal-commander/config.json`
- **Scopes**: Read and write access (`https://www.googleapis.com/auth/calendar.readonly` for read operations, additional scopes for create operations)
- **API**: Uses Google Calendar API v3 via `googleapis` library

## Testing

Uses `@oclif/test` with `runCommand()` helper to test CLI commands end-to-end. Tests verify command output using Chai expectations.

## Current Features

For a complete list of features and detailed usage examples, see the **Features** and **Commands** sections in [README.md](../README.md).

Key capabilities include:
- Google Calendar event and calendar management (read, create, display)
- Event creation with flexible time specification (all-day, timed events, duration-based)
- Attendee management and event invitations
- Secure OAuth2 authentication with token refresh
- Configuration management with customizable defaults
- Multiple output formats (table/JSON) with `--quiet` mode support

## Development Guidelines

### Critical Maintenance Requirements

- **🔄 Repository Structure Updates**: **MANDATORY** - Any time directories or files are added/removed/moved, the Repository Structure section above must be updated immediately. This includes:
  - New command files in `src/commands/`
  - New test files in `test/`
  - New service or utility files
  - Configuration or documentation files
  - Build output changes
- **📖 README Synchronization**: When adding new commands or changing command options, always update the README.md file with usage examples and documentation
- **🏗️ Architecture Documentation**: When making significant architectural changes (new services, major feature additions), update the Architecture section in `.claude/core.md`

### Documentation Maintenance Workflow

1. **Before making structural changes**: Review current Repository Structure section
2. **During development**: Note any new files/directories being created
3. **After implementation**: Update Repository Structure section to reflect all changes
4. **Verification**: Ensure the documentation matches the actual file system structure

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