# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

For daily development work, refer to `.claude/core.md` which contains:
- Project overview and tech stack
- Essential development commands
- Architecture and framework patterns
- oclif best practices and logging conventions

## Context-Sensitive Documentation

Additional documentation is available in `.claude/` directory and should be read when needed:

- **Feature development**: Read `.claude/features.md` for current features and problem-solving methodology
- **Test-driven development**: Read `.claude/tdd.md` for TDD practices, Red-Green-Refactor cycle, and CLI testing patterns
- **Release/process work**: Read `.claude/processes.md` for release workflow, pre-commit hooks, and setup requirements

## Auto-Loading Instructions

When working on tasks that require deeper context:

1. **For new features or major changes**: Also read `.claude/features.md`
2. **For testing or quality work**: Review `.claude/tdd.md` for comprehensive TDD practices
3. **For release or CI/CD work**: Also read `.claude/processes.md`
4. **For authentication or API work**: Check Google Calendar integration details in `.claude/features.md`

## Essential Daily Information

- **Tech Stack**: oclif CLI framework + TypeScript + Google Calendar API
- **Commands**: `npm test`, `npm run lint`, `npm run build`
- **Entry Point**: `./bin/run.js` or `gcal` command
- **Base Class**: All commands extend `BaseCommand` with `--quiet` flag support

## Development Workflow

1. Read `.claude/core.md` for architecture patterns
2. Follow TDD practices from `.claude/tdd.md`
3. Use oclif logging methods (never console.log)
4. Separate stdout (data) from stderr (status messages)
5. Run tests after changes: `npm test`

## Special Commands

- **`remember`**: When user says "remember", add the information to appropriate CLAUDE.md or `.claude/*.md` files based on content type (core/features/processes)