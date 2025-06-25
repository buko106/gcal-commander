import 'reflect-metadata';
import { container } from 'tsyringe';

import { IAuthService, ICalendarService } from '../interfaces/services';
import { AuthService } from '../services/auth';
import { CalendarService } from '../services/calendar';
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
}

// Initialize container
setupContainer();

export { container } from 'tsyringe';