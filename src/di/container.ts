import 'reflect-metadata';
import { container } from 'tsyringe';

import { IConfigStorage } from '../interfaces/config-storage';
import { IAuthService, ICalendarService, IConfigService, II18nService, IPromptService } from '../interfaces/services';
import { AuthService } from '../services/auth';
import { CalendarService } from '../services/calendar';
import { ConfigService } from '../services/config';
import { FileSystemConfigStorage } from '../services/config-storage';
import { I18nService } from '../services/i18n';
import { InquirerPromptService } from '../services/prompt';
import { TOKENS } from './tokens';

// Container setup
export function setupContainer(): void {
  // Register services
  container.register<IAuthService>(TOKENS.AuthService, {
    useClass: AuthService,
  });

  container.register<ICalendarService>(TOKENS.CalendarService, {
    useClass: CalendarService,
  });

  container.register<IConfigStorage>(TOKENS.ConfigStorage, {
    useClass: FileSystemConfigStorage,
  });

  container.registerSingleton<IConfigService>(TOKENS.ConfigService, ConfigService);

  container.register<II18nService>(TOKENS.I18nService, {
    useClass: I18nService,
  });

  container.register<IPromptService>(TOKENS.PromptService, {
    useClass: InquirerPromptService,
  });
}

setupContainer();
