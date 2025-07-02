# gcal init

Verify Google Calendar authentication setup and test your connection to the Google Calendar API.

## Usage

```bash
gcal init [options]
```

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--quiet` | `-q` | Suppress status messages | `false` |

## Description

The `init` command helps you verify that your Google Calendar authentication is working correctly. It performs a test connection to the Google Calendar API to ensure that:

- Your credentials file is properly configured
- Your authentication token is valid
- You have access to your Google Calendar

This command is particularly useful when:
- Setting up gcal-commander for the first time
- Troubleshooting authentication issues
- Verifying that your setup is working after making changes to credentials

## Examples

### Basic Usage

```bash
# Verify authentication with confirmation prompt
gcal init

# Verify authentication quietly (useful for scripts)
gcal init --quiet
```

## Interactive Flow

When you run `gcal init`, you will be prompted to confirm the authentication verification:

```
This will verify your Google Calendar authentication.
? Do you want to verify authentication? (Y/n) 
```

- Press Enter or type `y` to proceed with verification
- Type `n` to cancel the operation

**Note**: The initial status message "This will verify your Google Calendar authentication." is always shown, even with `--quiet` flag. The `--quiet` flag only suppresses the "Verifying Google Calendar authentication..." progress message.

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