import { Command, Flags } from '@oclif/core';

import { getContainerProvider } from './di/container-provider';
import { TOKENS } from './di/tokens';
import { IAuthService, ICalendarService, IConfigService, II18nService } from './interfaces/services';

export type OutputFormat = 'json' | 'pretty-json' | 'table';

export abstract class BaseCommand extends Command {
  static baseFlags = {
    format: Flags.string({
      char: 'f',
      default: 'table',
      description: 'Output format',
      options: ['json', 'pretty-json', 'table'],
    }),
    quiet: Flags.boolean({
      char: 'q',
      default: false,
      description: 'Suppress non-essential output (status messages, progress indicators)',
    }),
  };
protected authService!: IAuthService;
  protected calendarService!: ICalendarService;
  protected configService!: IConfigService;
  protected format: OutputFormat = 'table';
  protected i18nService!: II18nService;
  protected quiet = false;

  protected getContainer() {
    return getContainerProvider().getContainer();
  }

  async init(): Promise<void> {
    await super.init();
    const { flags } = await this.parse(this.constructor as typeof BaseCommand);
    this.format = flags.format as OutputFormat;
    this.quiet = flags.quiet;

    // Initialize services using TSyringe container
    this.authService = this.getContainer().resolve<IAuthService>(TOKENS.AuthService);
    this.configService = this.getContainer().resolve<IConfigService>(TOKENS.ConfigService);
  }

  /**
   * Initialize calendar service with authentication
   * Must be called by commands that need calendar access
   */
  protected async initCalendarService(): Promise<void> {
    this.calendarService = this.getContainer().resolve<ICalendarService>(TOKENS.CalendarService);
  }

  /**
   * Initialize i18n service for translations
   * Must be called by commands that need i18n support
   */
  protected async initI18nService(): Promise<void> {
    if (!this.i18nService) {
      this.i18nService = this.getContainer().resolve<II18nService>(TOKENS.I18nService);
      await this.i18nService.init();
    }
  }

  protected logError(message: string): never {
    this.error(message);
  }

  protected logResult(message: string): void {
    this.log(message);
  }

  protected logStatus(message: string): void {
    if (!this.quiet) {
      this.logToStderr(message);
    }
  }

  protected outputJson(data: unknown): void {
    if (this.format === 'pretty-json') {
      this.logResult(JSON.stringify(data, null, 2));
    } else if (this.format === 'json') {
      this.logResult(JSON.stringify(data));
    } else {
      this.logJson(data);
    }
  }

  protected t(key: string, options?: unknown): string {
    if (!this.i18nService) {
      throw new Error('I18n service not initialized. Call initI18nService() first.');
    }

    return this.i18nService.t(key, options);
  }
}