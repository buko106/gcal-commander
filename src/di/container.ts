import 'reflect-metadata';
import { container } from 'tsyringe';

import { IAuthService, ICalendarService, IPromptService } from '../interfaces/services';
import { AuthService } from '../services/auth';
import { CalendarService } from '../services/calendar';
import { InquirerPromptService } from '../services/prompt';
import { setContainerProvider } from './container-provider';
import { ProductionContainerProvider } from './production-container-provider';
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

  container.register<IPromptService>(TOKENS.PromptService, {
    useClass: InquirerPromptService,
  });
}

// Initialize container and set production provider
setupContainer();
setContainerProvider(new ProductionContainerProvider());

export { container } from 'tsyringe';