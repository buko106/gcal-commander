import { Command, Flags } from '@oclif/core';

import { container } from './di/container';
import { getTestContainer } from './di/test-container';
import { TOKENS } from './di/tokens';
import { IAuthService, ICalendarService } from './interfaces/services';

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
  protected format: OutputFormat = 'table';
  protected quiet = false;

  async init(): Promise<void> {
    await super.init();
    const { flags } = await this.parse(this.constructor as typeof BaseCommand);
    this.format = flags.format as OutputFormat;
    this.quiet = flags.quiet;

    // Initialize services using TSyringe container
    this.authService = this.getContainer().resolve<IAuthService>(TOKENS.AuthService);
  }

  /**
   * Initialize calendar service with authentication
   * Must be called by commands that need calendar access
   */
  protected async initCalendarService(): Promise<void> {
    this.calendarService = this.getContainer().resolve<ICalendarService>(TOKENS.CalendarService);
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

  private getContainer() {
    // Use test container if available, otherwise use production container
    try {
      return getTestContainer();
    } catch {
      return container;
    }
  }
}