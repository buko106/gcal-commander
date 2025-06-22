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

## Architecture

Built on oclif CLI framework:
- **Commands**: Located in `src/commands/` with nested structure:
  - `events/list.ts` - List calendar events (supports config defaults)
  - `events/show.ts` - Show event details
  - `calendars/list.ts` - List available calendars
  - `config.ts` - Manage global configuration settings
- **Base Command**: `src/base-command.ts` provides common functionality:
  - Universal `--quiet` flag support across all commands
  - Logging method separation (status, result, error)
  - Consistent output behavior and flag inheritance
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

Commands extend the `BaseCommand` class (which extends oclif's `Command`) with:
- Static `args` and `flags` for CLI arguments
- Static `description` and `examples` for help text
- `async run()` method for command logic
- Automatic `--quiet` flag inheritance from BaseCommand
- Use specialized logging methods: `logStatus()`, `logResult()`, `logError()`

### oclif Framework Best Practices

#### Built-in Logging Methods
Always prefer oclif's built-in logging methods over custom implementations:

- **`this.log(message)`** - Output to stdout (suppressed in JSON mode)
- **`this.logToStderr(message)`** - Output to stderr (suppressed in JSON mode)
- **`this.logJson(data)`** - Format and output JSON to stdout with proper styling
- **`this.error(message)`** - Output error and exit with code 1

#### BaseCommand Logging Methods
Use BaseCommand's specialized logging methods for consistent --quiet flag behavior:

- **`this.logStatus(message)`** - Progress/status messages to stderr (suppressed with --quiet)
- **`this.logResult(message)`** - Command results to stdout (always shown)
- **`this.logError(message)`** - Error messages and exit (always shown)

#### CLI Output Design Principles

Follow Unix CLI best practices for clean, pipeable output:

**stdout (Standard Output)**:
- Reserved exclusively for actual command results/data
- Should be clean and parseable when using `--format json`
- Must support piping: `gcal events list --format json | jq`
- Use `this.log()` or `this.logJson()` for data output

**stderr (Standard Error)**:
- Used for status messages, progress indicators, and diagnostics
- Authentication messages, "Fetching..." status updates
- Error messages and warnings
- Use `this.logToStderr()` for all informational messages

**Example Implementation**:
```typescript
// ✅ Correct: Status to stderr, data to stdout
this.logToStderr('Authenticating with Google Calendar...');
const events = await calendarService.listEvents();

if (format === 'json') {
  this.logJson(events);  // Clean JSON to stdout
} else {
  this.displayEventsTable(events);  // Table to stdout via this.log()
}

// ❌ Incorrect: Mixed output corrupts JSON parsing
this.log('Authenticating...');  // This breaks JSON piping
console.log(JSON.stringify(events));  // Raw JSON without oclif styling
```

#### Framework Investigation First

Before implementing custom solutions:
1. **Check oclif documentation** for built-in functionality
2. **Search existing codebase** for similar patterns
3. **Test framework capabilities** with simple examples
4. **Consider Unix CLI conventions** for standard behavior

Common oclif features to leverage:
- Automatic JSON flag handling (`--json` suppresses logs)
- Built-in flag validation and parsing
- Error handling with proper exit codes
- Command help generation
- Plugin architecture for extensibility

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

### Test-Driven Development Best Practices

When implementing new features or fixing bugs, follow these step-by-step testing practices:

#### 1. **Small, Incremental Steps**
- Break complex changes into the smallest possible units
- Implement one change at a time with immediate testing
- Each step should be independently testable and verifiable

#### 2. **Test-First Approach**
- Write tests before implementing functionality when possible
- Create failing tests that define expected behavior
- Implement code to make tests pass
- Refactor while keeping tests green

#### 3. **Step-by-Step Testing Process**
```bash
# Example workflow for a new feature
1. Write utility/service tests first
   npm test -- --grep "UtilityName"
   
2. Implement utility/service functionality
   npm test -- --grep "UtilityName"
   
3. Write command tests
   npm test -- --grep "CommandName"
   
4. Implement command functionality
   npm test -- --grep "CommandName"
   
5. Run full test suite
   npm test
   
6. Fix any integration issues
   npm test
```

#### 4. **Testing Granularity**
- **Unit Tests**: Test individual functions and classes in isolation
- **Integration Tests**: Test command behavior end-to-end using `@oclif/test`
- **Output Separation Tests**: Verify stdout/stderr separation for JSON vs table formats
- **Error Handling Tests**: Test authentication failures and edge cases

#### 5. **Continuous Verification**
- Run tests after each small change
- Verify both new and existing functionality
- Run linting to catch style issues early: `npm run lint`
- Use `npm run build` to catch TypeScript compilation errors

#### 6. **Test Organization**
- Mirror `src/` structure in `test/` directory
- Group related tests using `describe()` blocks
- Use descriptive test names that explain the expected behavior
- Test both success and failure scenarios

#### 7. **CLI-Specific Testing**
- Use `@oclif/test`'s `runCommand()` for end-to-end command testing
- Test stdout/stderr separation: `const {stdout, stderr} = await runCommand(...)`
- Test command flag parsing and validation
- Test authentication flow behavior (success/failure cases)
- Verify JSON output is clean and parseable (no status messages mixed in)

**Essential CLI Test Patterns**:
```typescript
// Test stdout/stderr separation
it('separates status from data output', async () => {
  const {stderr, stdout} = await runCommand('events list --format json');
  expect(stderr).to.contain('Authenticating with Google Calendar...');
  expect(stdout).to.not.contain('Authenticating');
  expect(() => JSON.parse(stdout)).to.not.throw(); // Clean JSON
});

// Test pipeable output
it('produces clean JSON for piping', async () => {
  const {stdout} = await runCommand('events list --format json');
  const events = JSON.parse(stdout); // Should not throw
  expect(Array.isArray(events)).to.be.true;
});
```

#### 8. **Refactoring Safety**
- Keep existing tests passing during refactoring
- Add new tests for new functionality before changing implementation
- Run full test suite before and after major changes
- Use TypeScript compilation as an additional safety net

This approach ensures robust, maintainable code and prevents regressions while making it easy to identify and fix issues quickly.

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
- **Document findings**: Update CLAUDE.md with learnings
- **Refactor safely**: Use tests to ensure no regressions

### Common Anti-Patterns to Avoid

- **Not checking framework capabilities first** - Always research before building
- **Mixing stdout/stderr inappropriately** - Breaks piping and Unix conventions
- **Custom implementations of standard features** - Increases maintenance burden
- **Skipping comparative analysis** - May choose suboptimal approach
- **Large, untested changes** - Makes debugging and verification difficult

This methodology ensures well-informed technical decisions and maintainable solutions.