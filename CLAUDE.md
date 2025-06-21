# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `gcal-commander`, a Google Calendar CLI tool built with the oclif framework. Currently contains placeholder "hello" commands but is intended to become a Google Calendar management tool.

## Development Commands

- `npm run build` - Build TypeScript to dist/ directory
- `npm run test` - Run Mocha tests with pattern "test/**/*.test.ts"  
- `npm run lint` - Run ESLint
- `npm run posttest` - Automatically runs lint after tests
- `./bin/run.js COMMAND` or `gcal COMMAND` - Run CLI commands locally

## Architecture

Built on oclif CLI framework:
- **Commands**: Located in `src/commands/` with nested structure (e.g., `hello/index.ts`, `hello/world.ts`)
- **Tests**: Mirror command structure in `test/commands/` using Mocha and Chai
- **CLI Entry**: `bin/run.js` points to built commands in `dist/commands/`
- **Configuration**: oclif config in package.json defines bin name "gcal", command discovery, and topics

## Command Structure

Commands extend oclif's `Command` class with:
- Static `args` and `flags` for CLI arguments
- Static `description` and `examples` for help text
- `async run()` method for command logic
- Use `this.log()` for output and `this.parse()` for argument parsing

## Testing

Uses `@oclif/test` with `runCommand()` helper to test CLI commands end-to-end. Tests verify command output using Chai expectations.

## Git Conventions

- All commit messages should be written in English
- Follow conventional commit format when possible