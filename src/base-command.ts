import { Command, Flags } from '@oclif/core';

import { IAuthService, ICalendarService } from './interfaces/services';
import { AuthService } from './services/auth';
import { CalendarService } from './services/calendar';
import { ServiceRegistry } from './services/service-registry';

export abstract class BaseCommand extends Command {
  static baseFlags = {
    quiet: Flags.boolean({
      char: 'q',
      default: false,
      description: 'Suppress non-essential output (status messages, progress indicators)',
    }),
  };
protected authService!: IAuthService;
  protected calendarService!: ICalendarService;
  protected quiet = false;

  async init(): Promise<void> {
    await super.init();
    const { flags } = await this.parse(this.constructor as typeof BaseCommand);
    this.quiet = flags.quiet;

    // Initialize services using ServiceRegistry
    this.authService = ServiceRegistry.get<IAuthService>(
      'AuthService',
      () => new AuthService()
    );
  }

  /**
   * Initialize calendar service with authentication
   * Must be called by commands that need calendar access
   */
  protected async initCalendarService(): Promise<void> {
    this.calendarService = ServiceRegistry.get<ICalendarService>(
      'CalendarService',
      () => 
        // This is a factory that will be called synchronously
        // We'll use a lazy initialization pattern in the service itself
         new CalendarService(this.authService)
      
    );
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
}