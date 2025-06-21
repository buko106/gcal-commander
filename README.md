gcal-commander
=================

A command-line interface for Google Calendar operations. Manage your Google Calendar events and calendars directly from the terminal.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)


## Features

- 📅 **Read Google Calendar events** - List and view detailed event information
- 📋 **Manage multiple calendars** - Access all your Google calendars
- 🔐 **Secure OAuth2 authentication** - One-time setup with automatic token refresh
- 💻 **Terminal-friendly output** - Clean table format or JSON for scripting
- 🚀 **Fast and lightweight** - Built with oclif framework

## Quick Start

### Prerequisites

1. **Google Cloud Console Setup**
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials for a desktop application
   - Download the credentials JSON file

2. **Setup credentials**
   ```bash
   mkdir -p ~/.gcal-commander
   cp /path/to/your/credentials.json ~/.gcal-commander/credentials.json
   ```

### Basic Usage

```bash
# List all your calendars
gcal calendars list

# List upcoming events from your primary calendar
gcal events list

# List events from a specific calendar
gcal events list my-calendar@gmail.com

# Show detailed information about an event
gcal events show <event-id>

# Limit number of events and time range
gcal events list --max-results 5 --days 7
```

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g gcal-commander
$ gcal COMMAND
running command...
$ gcal (--version)
gcal-commander/0.0.0 darwin-arm64 node-v18.20.8
$ gcal --help [COMMAND]
USAGE
  $ gcal COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gcal hello PERSON`](#gcal-hello-person)
* [`gcal hello world`](#gcal-hello-world)
* [`gcal help [COMMAND]`](#gcal-help-command)
* [`gcal plugins`](#gcal-plugins)
* [`gcal plugins add PLUGIN`](#gcal-plugins-add-plugin)
* [`gcal plugins:inspect PLUGIN...`](#gcal-pluginsinspect-plugin)
* [`gcal plugins install PLUGIN`](#gcal-plugins-install-plugin)
* [`gcal plugins link PATH`](#gcal-plugins-link-path)
* [`gcal plugins remove [PLUGIN]`](#gcal-plugins-remove-plugin)
* [`gcal plugins reset`](#gcal-plugins-reset)
* [`gcal plugins uninstall [PLUGIN]`](#gcal-plugins-uninstall-plugin)
* [`gcal plugins unlink [PLUGIN]`](#gcal-plugins-unlink-plugin)
* [`gcal plugins update`](#gcal-plugins-update)

## `gcal hello PERSON`

Say hello

```
USAGE
  $ gcal hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ gcal hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/buko106/gcal-commander/blob/v0.0.0/src/commands/hello/index.ts)_

## `gcal hello world`

Say hello world

```
USAGE
  $ gcal hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ gcal hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/buko106/gcal-commander/blob/v0.0.0/src/commands/hello/world.ts)_

## `gcal help [COMMAND]`

Display help for gcal.

```
USAGE
  $ gcal help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for gcal.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.29/src/commands/help.ts)_

## `gcal plugins`

List installed plugins.

```
USAGE
  $ gcal plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ gcal plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.41/src/commands/plugins/index.ts)_

## `gcal plugins add PLUGIN`

Installs a plugin into gcal.

```
USAGE
  $ gcal plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into gcal.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the GCAL_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the GCAL_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ gcal plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ gcal plugins add myplugin

  Install a plugin from a github url.

    $ gcal plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ gcal plugins add someuser/someplugin
```

## `gcal plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ gcal plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ gcal plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.41/src/commands/plugins/inspect.ts)_

## `gcal plugins install PLUGIN`

Installs a plugin into gcal.

```
USAGE
  $ gcal plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into gcal.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the GCAL_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the GCAL_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ gcal plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ gcal plugins install myplugin

  Install a plugin from a github url.

    $ gcal plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ gcal plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.41/src/commands/plugins/install.ts)_

## `gcal plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ gcal plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ gcal plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.41/src/commands/plugins/link.ts)_

## `gcal plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ gcal plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gcal plugins unlink
  $ gcal plugins remove

EXAMPLES
  $ gcal plugins remove myplugin
```

## `gcal plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ gcal plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.41/src/commands/plugins/reset.ts)_

## `gcal plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ gcal plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gcal plugins unlink
  $ gcal plugins remove

EXAMPLES
  $ gcal plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.41/src/commands/plugins/uninstall.ts)_

## `gcal plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ gcal plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gcal plugins unlink
  $ gcal plugins remove

EXAMPLES
  $ gcal plugins unlink myplugin
```

## `gcal plugins update`

Update installed plugins.

```
USAGE
  $ gcal plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.41/src/commands/plugins/update.ts)_
<!-- commandsstop -->
