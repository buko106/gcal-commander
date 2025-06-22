import { Args, Command, Flags } from '@oclif/core';

import { ConfigService } from '../services/config';

export default class Config extends Command {
  /* eslint-disable perfectionist/sort-objects */
  static args = {
    subcommand: Args.string({
      description: 'Config subcommand',
      options: ['get', 'set', 'list', 'unset', 'reset'],
      required: true,
    }),
    key: Args.string({
      description: 'Configuration key',
      required: false,
    }),
    value: Args.string({
      description: 'Configuration value',
      required: false,
    }),
  };
  /* eslint-enable perfectionist/sort-objects */
static description = 'Manage global configuration settings';
static examples = [
    '<%= config.bin %> <%= command.id %> set defaultCalendar my-work@gmail.com',
    '<%= config.bin %> <%= command.id %> get defaultCalendar',
    '<%= config.bin %> <%= command.id %> list',
    '<%= config.bin %> <%= command.id %> unset defaultCalendar',
    '<%= config.bin %> <%= command.id %> reset',
  ];
static flags = {
    confirm: Flags.boolean({
      default: false,
      description: 'Skip confirmation prompt for reset',
    }),
    format: Flags.string({
      char: 'f',
      default: 'table',
      description: 'Output format',
      options: ['table', 'json'],
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Config);
    const configService = ConfigService.getInstance();

    switch (args.subcommand) {
      case 'get': {
        await this.handleGet(configService, args.key);
        break;
      }

      case 'list': {
        await this.handleList(configService, flags.format);
        break;
      }

      case 'reset': {
        await this.handleReset(configService, flags.confirm);
        break;
      }

      case 'set': {
        await this.handleSet(configService, args.key, args.value);
        break;
      }

      case 'unset': {
        await this.handleUnset(configService, args.key);
        break;
      }
    }
  }

  private async handleGet(configService: ConfigService, key?: string): Promise<void> {
    if (!key) {
      this.error('Key is required for get command\nUsage: gcal config get <key>');
    }

    if (!configService.validateKey(key)) {
      this.error(`Invalid configuration key: ${key}\nValid keys: defaultCalendar, events.maxResults, events.format, events.days`);
    }

    const value = await configService.get(key);
    if (value === undefined) {
      this.log(`Configuration key '${key}' is not set`);
    } else {
      this.log(`${key} = ${JSON.stringify(value)}`);
    }
  }

  private async handleList(configService: ConfigService, format: string): Promise<void> {
    const config = await configService.list();
    
    if (format === 'json') {
      this.log(JSON.stringify(config, null, 2));
    } else {
      this.log('Current configuration:');
      this.log(`Config file: ${configService.getConfigPath()}`);
      this.log('');
      
      if (Object.keys(config).length === 0) {
        this.log('No configuration set');
      } else {
        this.printConfigTable(config);
      }
    }
  }

  private async handleReset(configService: ConfigService, confirm: boolean): Promise<void> {
    if (!confirm) {
      this.log('This will reset all configuration settings.');
      this.log('Use --confirm flag to proceed: gcal config reset --confirm');
      return;
    }

    await configService.reset();
    this.log('All configuration settings have been reset');
  }

  private async handleSet(configService: ConfigService, key?: string, value?: string): Promise<void> {
    if (!key || value === undefined) {
      this.error('Key and value are required for set command\nUsage: gcal config set <key> <value>');
    }

    if (!configService.validateKey(key)) {
      this.error(`Invalid configuration key: ${key}\nValid keys: defaultCalendar, events.maxResults, events.format, events.days`);
    }

    // Parse value based on key type
    let parsedValue: unknown = value;
    if (key === 'events.maxResults' || key === 'events.days') {
      const numValue = Number(value);
      if (Number.isNaN(numValue)) {
        this.error(`Invalid number value for ${key}: ${value}`);
      }

      parsedValue = numValue;
    }

    const validation = configService.validateValue(key, parsedValue);
    if (!validation.valid) {
      this.error(validation.error!);
    }

    await configService.set(key, parsedValue);
    this.log(`Set ${key} = ${JSON.stringify(parsedValue)}`);
  }

  private async handleUnset(configService: ConfigService, key?: string): Promise<void> {
    if (!key) {
      this.error('Key is required for unset command\nUsage: gcal config unset <key>');
    }

    if (!configService.validateKey(key)) {
      this.error(`Invalid configuration key: ${key}\nValid keys: defaultCalendar, events.maxResults, events.format, events.days`);
    }

    const currentValue = await configService.get(key);
    if (currentValue === undefined) {
      this.log(`Configuration key '${key}' is not set`);
      return;
    }

    await configService.unset(key);
    this.log(`Unset ${key}`);
  }

  private printConfigTable(config: Record<string, unknown>): void {
    const flattenConfig = (obj: Record<string, unknown>, prefix = ''): Array<[string, unknown]> => {
      const entries: Array<[string, unknown]> = [];
      
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          entries.push(...flattenConfig(value as Record<string, unknown>, fullKey));
        } else {
          entries.push([fullKey, value]);
        }
      }
      
      return entries;
    };

    const entries = flattenConfig(config);
    
    for (const [key, value] of entries) {
      this.log(`${key.padEnd(20)} = ${JSON.stringify(value)}`);
    }
  }

}