# gcal init

Interactive setup with language selection and Google Calendar authentication verification.

## Usage

```bash
gcal init [options]
```

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--format` | `-f` | Output format (table, json, or pretty-json) | `table` |
| `--quiet` | `-q` | Suppress non-essential output (status messages, progress indicators) | `false` |

## Description

The `init` command provides an interactive setup experience that helps you:

1. **Select your preferred language** from supported options (English, Japanese, Spanish, German, Portuguese, French, Korean)
2. **Verify Google Calendar authentication** by testing your connection to the Google Calendar API

It ensures that:
- Your interface language is configured to your preference
- Your credentials file is properly configured
- Your authentication token is valid
- You have access to your Google Calendar

This command is particularly useful when:
- Setting up gcal-commander for the first time
- Changing your interface language preference
- Troubleshooting authentication issues
- Verifying that your setup is working after making changes to credentials

## Examples

### Basic Usage

```bash
# Interactive setup with language selection and authentication verification
gcal init

# Run setup quietly (useful for scripts)
gcal init --quiet
```

## Interactive Flow

When you run `gcal init`, you'll go through a two-step interactive process:

### Step 1: Language Selection

First, you'll be prompted to select your preferred interface language:

```
? Select your preferred language (Use arrow keys)
❯ English (en)
  日本語 (ja)
  Español (es)
  Deutsch (de)
  Português (pt)
  Français (fr)
  한국어 (ko)
```

- Use arrow keys to navigate
- Press Enter to select your preferred language
- Your choice will be saved to your configuration

### Step 2: Authentication Verification

After language selection, you'll be prompted to verify your Google Calendar authentication:

```
? Do you want to verify authentication? (Y/n) 
```

- Press Enter or type `y` to proceed with verification
- Type `n` to skip authentication verification

**Note**: The `--quiet` flag suppresses interactive prompts and uses default values where possible.

## Success Output

If authentication is successful:

```
✓ Verifying Google Calendar authentication...
Authentication successful!
```

## Error Handling

If authentication fails, you'll see an error message with troubleshooting information:

```
✗ Verifying Google Calendar authentication...
Authentication failed: [error details]
Try running the command again or check your Google Calendar API credentials.
```

Common authentication errors include:
- Missing or invalid credentials file
- Expired authentication token
- Insufficient permissions
- Network connectivity issues

## Prerequisites

Before running `gcal init`, ensure you have:

1. **Google Calendar API enabled** in your Google Cloud Console
2. **OAuth 2.0 credentials** downloaded and placed in `~/.gcal-commander/credentials.json`
3. **Network access** to Google's APIs

If you haven't set up authentication yet, follow the [Initial Setup](../README.md#initial-setup) guide in the README.

## Troubleshooting

### Authentication Fails

If `gcal init` fails:

1. **Check credentials file**: Ensure `~/.gcal-commander/credentials.json` exists and contains valid OAuth 2.0 credentials
2. **Regenerate token**: Delete `~/.gcal-commander/token.json` and run any gcal command to re-authenticate
3. **Verify API access**: Ensure Google Calendar API is enabled in your Google Cloud Console
4. **Check network**: Verify you have internet access and can reach Google's servers

### File Permissions

If you encounter permission errors:

```bash
# Check file permissions
ls -la ~/.gcal-commander/

# Fix permissions if needed
chmod 600 ~/.gcal-commander/credentials.json
chmod 600 ~/.gcal-commander/token.json
```

## Use Cases

- **First-time setup** - Configure language preference and verify authentication
- **Language switching** - Change your interface language to one of the 7 supported options
- **Initial setup verification** - Confirm your authentication is working after setup
- **Troubleshooting** - Diagnose authentication issues
- **CI/CD integration** - Verify authentication in automated environments
- **Health checks** - Periodically verify that your authentication is still valid

## Related Commands

- [`gcal calendars list`](calendars-list.md) - List available calendars (also tests authentication)
- [`gcal events list`](events-list.md) - List events (requires authentication)
- [`gcal config`](config.md) - Manage configuration settings

## See Also

- [Initial Setup Guide](../README.md#initial-setup) - Complete setup instructions
- [Google Calendar API Setup](https://console.cloud.google.com/) - Google Cloud Console