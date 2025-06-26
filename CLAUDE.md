# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Documentation

### Daily Development
@.claude/core.md
Essential information for daily development work including project overview, commands, architecture patterns, and oclif best practices.

### Test-Driven Development
@.claude/tdd-workflow.md
Red-Green-Refactor micro-cycle workflow with practical commands and CLI testing patterns.

### Dependency Injection & Testing
@.claude/di.md
Project-specific DI container setup for integration tests with mock services.

### Release Process
@.claude/release-flow.md
Automated release workflow using semantic-release, conventional commits, and GitHub Actions.

## Quick Reference

- **Tech Stack**: oclif CLI framework + TypeScript + Google Calendar API
- **Development**: `./bin/dev.js COMMAND` (instant TypeScript changes)
- **Production**: `./bin/run.js COMMAND` (requires build)
- **Tests**: `npm test` or `npm run test:file [pattern]`
- **Linting**: `npm run lint`

## Development Workflow

1. Use development mode: `./bin/dev.js COMMAND`
2. Follow TDD micro-cycle from @.claude/tdd-workflow.md
3. Use oclif logging methods (never console.log)
4. Separate stdout (data) from stderr (status messages)
5. Run tests and lint before commits
6. Follow conventional commit format for releases

## Special Commands

- **`remember`**: Add information to appropriate `.claude/*.md` files based on content type