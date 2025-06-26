# Release Flow

## Automated Release Process

This project uses **semantic-release** for fully automated releases triggered by **GitHub Actions** when code is pushed to the main branch.

## Commit Message Format

All commits must follow **Conventional Commits** specification:

```bash
# Version bump types
feat: add new calendar filtering feature     # Minor version (0.1.0 → 0.2.0)
fix: resolve timezone display issue         # Patch version (0.1.0 → 0.1.1)
docs: update installation guide             # No version bump
```

### Breaking Changes
```bash
feat!: change API response format
# OR
feat: change API response format

BREAKING CHANGE: API now returns ISO dates instead of timestamps
# Results in major version bump (0.1.0 → 1.0.0)
```

## Release Workflow

### 1. Development & Commits
```bash
# Make changes and commit using conventional format
git commit -m "feat: add event creation command"
git commit -m "fix: handle empty calendar lists"
```

### 2. Documentation Review
```bash
# Verify documentation matches implementation
# - README.md usage examples and command options
# - docs/ directory command documentation
# - Feature descriptions and API changes
```

### 3. Create Pull Request & Release
```bash
git push origin feature-branch
# Create PR, review, merge to main
# Automatic release triggers on main branch push
```

### 4. Automatic Release (GitHub Actions)
1. **Tests run first** - Release only happens if tests pass
2. **semantic-release** analyzes commit messages
3. **Version determined** automatically based on commit types
4. **CHANGELOG.md** generated from commit history
5. **GitHub Release** created with release notes
6. **Git tag** created (e.g., `v1.2.0`)
7. **npm package** published to registry

## Commit Types Reference

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat:` | New feature | Minor |
| `fix:` | Bug fix | Patch |
| `docs:` | Documentation | None |
| `style:` | Code style changes | None |
| `refactor:` | Code refactoring | None |
| `test:` | Test changes | None |
| `chore:` | Build/config changes | None |
| `BREAKING CHANGE:` | Breaking change | Major |

## GitHub Actions Configuration

- **Trigger**: Push to main branch
- **Two-stage pipeline**: test → release
- **Requirements**: All tests must pass before release
- **Authentication**: GitHub Token + NPM Token

