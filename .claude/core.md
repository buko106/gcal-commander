# Core Development Information

## Project Overview

This is `gcal-commander`, a Google Calendar CLI tool built with the oclif framework. Provides read-only access to Google Calendar events and calendars via command-line interface with OAuth2 authentication.

## Development Commands

- `npm run build` - Build TypeScript to dist/ directory
- `npm run test` - Run Mocha tests with pattern "test/**/*.test.ts"  
- `npm run test:file [file(s)]` - Run specific test file(s) or patterns
- `npm run lint` - Run ESLint
- `npm run posttest` - Automatically runs lint after tests

### CLI Execution Modes

- **Development mode**: `./bin/dev.js COMMAND` 
  - Uses ts-node to run TypeScript source files directly from src/
  - Instant changes without compilation - ideal for active development
  - Requires no build step
- **Production mode**: `./bin/run.js COMMAND` or `gcal COMMAND`
  - Uses compiled JavaScript from dist/ directory
  - Requires `npm run build` before running after code changes
  - Used for final testing and distribution

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
  - `src/services/prompt.ts` provides InquirerPromptService for CLI interactions
- **Tests**: Mirror command structure in `test/commands/` using Mocha and Chai
- **CLI Entry**: 
  - `bin/run.js` points to built commands in `dist/commands/` (production)
  - `bin/dev.js` loads TypeScript commands from `src/commands/` with ts-node (development)
- **Configuration**: oclif config in package.json defines bin name "gcal", command discovery, and topics

## Command Structure

Commands extend the `BaseCommand` class (which extends oclif's `Command`) with:
- Static `args` and `flags` for CLI arguments
- Static `description` and `examples` for help text
- `async run()` method for command logic
- Automatic `--quiet` flag inheritance from BaseCommand
- Use specialized logging methods: `logStatus()`, `logResult()`, `logError()`

## oclif Framework Best Practices

### Built-in Logging Methods
Always prefer oclif's built-in logging methods over custom implementations:

- **`this.log(message)`** - Output to stdout (suppressed in JSON mode)
- **`this.logToStderr(message)`** - Output to stderr (suppressed in JSON mode)
- **`this.logJson(data)`** - Format and output JSON to stdout with proper styling
- **`this.error(message)`** - Output error and exit with code 1

### BaseCommand Logging Methods
Use BaseCommand's specialized logging methods for consistent --quiet flag behavior:

- **`this.logStatus(message)`** - Progress/status messages to stderr (suppressed with --quiet)
- **`this.logResult(message)`** - Command results to stdout (always shown)
- **`this.logError(message)`** - Error messages and exit (always shown)

### CLI Output Design Principles

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

### Framework Investigation First

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

## Interactive Prompts

### @inquirer/prompts Usage

Always use @inquirer/prompts through the InquirerPromptService:

```typescript
// ✅ Correct: Use InquirerPromptService
import { container } from '../di/container';
const promptService = container.get('promptService');
const answer = await promptService.confirm('Continue?');

// ❌ Incorrect: Direct @inquirer/prompts usage
import { confirm } from '@inquirer/prompts';
const answer = await confirm({ message: 'Continue?' });
```