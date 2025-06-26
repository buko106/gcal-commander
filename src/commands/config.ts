import { Args, Flags } from '@oclif/core';

import { BaseCommand } from '../base-command';
import { ConfigService } from '../services/config';

export default class Config extends BaseCommand {
   
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
static description = 'Manage global configuration settings';
static examples = [
    '<%= config.bin %> <%= command.id %> set defaultCalendar my-work@gmail.com',
    '<%= config.bin %> <%= command.id %> get defaultCalendar',
    '<%= config.bin %> <%= command.id %> list',
    '<%= config.bin %> <%= command.id %> unset defaultCalendar',
    '<%= config.bin %> <%= command.id %> reset',
  ];
static flags = {
    ...BaseCommand.baseFlags,
    confirm: Flags.boolean({
      default: false,
      description: 'Skip confirmation prompt for reset',
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
        await this.handleList(configService);
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
    this.validateKeyRequired(key, 'get');
    this.validateConfigKey(configService, key!);

    const value = await configService.get(key);
    if (value === undefined) {
      this.logResult(`Configuration key '${key}' is not set`);
    } else {
      this.logResult(`${key} = ${JSON.stringify(value)}`);
    }
  }

  private async handleList(configService: ConfigService): Promise<void> {
    const config = await configService.list();
    
    if (this.format === 'json' || this.format === 'pretty-json') {
      this.outputJson(config);
    } else {
      this.logStatus('Current configuration:');
      this.logStatus(`Config file: ${configService.getConfigPath()}`);
      this.logResult('');
      
      if (Object.keys(config).length === 0) {
        this.logResult('No configuration set');
      } else {
        this.printConfigTable(config);
      }
    }
  }

  private async handleReset(configService: ConfigService, confirm: boolean): Promise<void> {
    if (!confirm) {
      this.logResult('This will reset all configuration settings.');
      this.logResult('Use --confirm flag to proceed: gcal config reset --confirm');
      return;
    }

    await configService.reset();
    this.logResult('All configuration settings have been reset');
  }

  private async handleSet(configService: ConfigService, key?: string, value?: string): Promise<void> {
    if (!key || value === undefined) {
      this.logError('Key and value are required for set command\nUsage: gcal config set <key> <value>');
    }

    this.validateConfigKey(configService, key!);

    // Parse value based on key type
    let parsedValue: unknown = value;
    if (key === 'events.maxResults' || key === 'events.days') {
      const numValue = Number(value);
      if (Number.isNaN(numValue)) {
        this.logError(`Invalid number value for ${key}: ${value}`);
      }

      parsedValue = numValue;
    }

    const validation = configService.validateValue(key, parsedValue);
    if (!validation.valid) {
      this.logError(validation.error!);
    }

    await configService.set(key, parsedValue);
    this.logResult(`Set ${key} = ${JSON.stringify(parsedValue)}`);
  }

  private async handleUnset(configService: ConfigService, key?: string): Promise<void> {
    this.validateKeyRequired(key, 'unset');
    this.validateConfigKey(configService, key!);

    const currentValue = await configService.get(key);
    if (currentValue === undefined) {
      this.logResult(`Configuration key '${key}' is not set`);
      return;
    }

    await configService.unset(key);
    this.logResult(`Unset ${key}`);
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
      this.logResult(`${key.padEnd(20)} = ${JSON.stringify(value)}`);
    }
  }

  private validateConfigKey(configService: ConfigService, key: string): void {
    if (!configService.validateKey(key)) {
      this.logError(`Invalid configuration key: ${key}\nValid keys: ${configService.getValidKeys().join(', ')}`);
    }
  }

  private validateKeyRequired(key: string | undefined, command: string): asserts key is string {
    if (!key) {
      this.logError(`Key is required for ${command} command\nUsage: gcal config ${command} <key>`);
    }
  }
}