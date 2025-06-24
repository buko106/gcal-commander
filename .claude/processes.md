# Processes and Setup Information

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

## Setup Requirements

Before using the CLI, users need:
1. Google Cloud Console project with Calendar API enabled
2. OAuth2 desktop application credentials
3. Credentials file placed at `~/.gcal-commander/credentials.json`

## Git Conventions

- All commit messages should be written in English
- Follow conventional commit format when possible