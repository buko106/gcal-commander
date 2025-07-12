import { Args, Flags } from '@oclif/core';

import { BaseCommand } from '../base-command';

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

    await this.initI18nService();

    switch (args.subcommand) {
      case 'get': {
        await this.handleGet(args.key);
        break;
      }

      case 'list': {
        await this.handleList();
        break;
      }

      case 'reset': {
        await this.handleReset(flags.confirm);
        break;
      }

      case 'set': {
        await this.handleSet(args.key, args.value);
        break;
      }

      case 'unset': {
        await this.handleUnset(args.key);
        break;
      }
    }
  }

  private async handleGet(key?: string): Promise<void> {
    this.validateKeyRequired(key, 'get');
    this.validateConfigKey(key!);

    const value = await this.configService.get(key);
    if (value === undefined) {
      this.logResult(this.t('config.get.keyNotSet', { key }));
    } else {
      this.logResult(`${key} = ${JSON.stringify(value)}`);
    }
  }

  private async handleList(): Promise<void> {
    const config = await this.configService.list();

    if (this.format === 'json' || this.format === 'pretty-json') {
      this.outputJson(config);
    } else {
      this.logStatus(this.t('config.list.currentConfiguration'));
      this.logStatus(this.t('config.list.configFile', { path: this.configService.getConfigPath() }));
      this.logResult('');

      if (Object.keys(config).length === 0) {
        this.logResult(this.t('config.list.noConfiguration'));
      } else {
        this.printConfigTable(config);
      }
    }
  }

  private async handleReset(confirm: boolean): Promise<void> {
    if (!confirm) {
      this.logResult(this.t('config.reset.confirmationMessage'));
      this.logResult(this.t('config.reset.useConfirmFlag'));
      return;
    }

    await this.configService.reset();
    this.logResult(this.t('config.reset.success'));
  }

  private async handleSet(key?: string, value?: string): Promise<void> {
    if (!key || value === undefined) {
      this.logError(this.t('config.set.keyAndValueRequired'));
    }

    this.validateConfigKey(key!);

    // Parse value based on key type
    let parsedValue: unknown = value;
    if (key === 'events.maxResults' || key === 'events.days') {
      const numValue = Number(value);
      if (Number.isNaN(numValue)) {
        this.logError(this.t('config.set.invalidNumberValue', { key, value }));
      }

      parsedValue = numValue;
    }

    const validation = this.configService.validateValue(key, parsedValue);
    if (!validation.valid) {
      if (validation.errorKey) {
        this.logError(this.t(validation.errorKey, validation.errorOptions));
      } else {
        this.logError(validation.error!);
      }
    }

    await this.configService.set(key, parsedValue);

    // Update i18n service language if language key was changed
    if (key === 'language') {
      await this.i18nService.changeLanguage(parsedValue as string);
    }

    this.logResult(this.t('config.set.success', { key, value: JSON.stringify(parsedValue) }));
  }

  private async handleUnset(key?: string): Promise<void> {
    this.validateKeyRequired(key, 'unset');
    this.validateConfigKey(key!);

    const currentValue = await this.configService.get(key);
    if (currentValue === undefined) {
      this.logResult(this.t('config.unset.keyNotSet', { key }));
      return;
    }

    await this.configService.unset(key);
    this.logResult(this.t('config.unset.success', { key }));
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

  private validateConfigKey(key: string): void {
    if (!this.configService.validateKey(key)) {
      this.logError(
        this.t('config.validation.invalidKey', {
          key,
          validKeys: this.configService.getValidKeys().join(', '),
        }),
      );
    }
  }

  private validateKeyRequired(key: string | undefined, command: string): asserts key is string {
    if (!key) {
      this.logError(this.t('config.validation.keyRequired', { command }));
    }
  }
}
