import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';

import { IAuthService, ICalendarService } from '../interfaces/services';
import { MockAuthService, MockCalendarService } from '../test-utils/mock-services';
import { TOKENS } from './tokens';

let testContainer: DependencyContainer | null = null;

/**
 * Setup test container with mocks
 * Should be called in beforeEach of test files
 */
export function setupTestContainer(): {
  mockAuthService: MockAuthService;
  mockCalendarService: MockCalendarService;
} {
  // Create child container for test isolation
  testContainer = container.createChildContainer();
  
  const mockAuthService = new MockAuthService();
  const mockCalendarService = new MockCalendarService();
  
  // Register mocks
  testContainer.register<IAuthService>(TOKENS.AuthService, {
    useValue: mockAuthService,
  });
  
  testContainer.register<ICalendarService>(TOKENS.CalendarService, {
    useValue: mockCalendarService,
  });

  return { mockAuthService, mockCalendarService };
}

/**
 * Clean up test container
 * Should be called in afterEach of test files
 */
export function cleanupTestContainer(): void {
  if (testContainer) {
    testContainer.clearInstances();
    testContainer = null;
  }
}

/**
 * Get test container instance
 * For use in tests that need to resolve services
 */
export function getTestContainer(): DependencyContainer {
  if (!testContainer) {
    throw new Error('Test container not initialized. Call setupTestContainer() first.');
  }

  return testContainer;
}