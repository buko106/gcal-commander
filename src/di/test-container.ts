import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';

import { IConfigStorage } from '../interfaces/config-storage';
import { IAuthService, ICalendarService, IConfigService, II18nService } from '../interfaces/services';
import { ConfigService } from '../services/config';
import { InMemoryConfigStorage } from '../services/config-storage';
import { I18nService } from '../services/i18n';
import { MockAuthService, MockCalendarService } from '../test-utils/mock-services';
import { setContainerProvider } from './container-provider';
import { ProductionContainerProvider } from './production-container-provider';
import { TestContainerProvider } from './test-container-provider';
import { TOKENS } from './tokens';

let testContainer: DependencyContainer | null = null;

/**
 * Set the test container instance (for use by TestContainerFactory)
 * @internal
 */
export function setTestContainer(container: DependencyContainer): void {
  testContainer = container;
}

/**
 * Setup test container with mocks
 * Should be called in beforeEach of test files
 * @deprecated Use TestContainerFactory.create() from test-container-factory instead
 */
export function setupTestContainer(): {
  mockAuthService: MockAuthService;
  mockCalendarService: MockCalendarService;
} {
  // Create child container for test isolation
  testContainer = container.createChildContainer();

  const mockAuthService = new MockAuthService();
  const mockCalendarService = new MockCalendarService();

  // Use InMemoryConfigStorage for test isolation
  // This prevents tests from interfering with real config files
  const configStorage = new InMemoryConfigStorage();
  const configService = new ConfigService(configStorage);

  // Create real I18nService for backward compatibility
  // This ensures all existing tests work with default English messages
  const i18nService = new I18nService();

  // Register mocks
  testContainer.register<IAuthService>(TOKENS.AuthService, {
    useValue: mockAuthService,
  });

  testContainer.register<ICalendarService>(TOKENS.CalendarService, {
    useValue: mockCalendarService,
  });

  // Register InMemoryConfigStorage and ConfigService for test isolation
  testContainer.register<IConfigStorage>(TOKENS.ConfigStorage, {
    useValue: configStorage,
  });

  testContainer.register<IConfigService>(TOKENS.ConfigService, {
    useValue: configService,
  });

  // Register real I18nService for backward compatibility
  testContainer.register<II18nService>(TOKENS.I18nService, {
    useValue: i18nService,
  });

  // Set the test container provider
  setContainerProvider(new TestContainerProvider());

  return { mockAuthService, mockCalendarService };
}

/**
 * Clean up test container
 * Should be called in afterEach of test files
 * @deprecated Use TestContainerFactory.cleanup() from test-container-factory instead
 */
export function cleanupTestContainer(): void {
  if (testContainer) {
    testContainer.clearInstances();
    testContainer = null;
  }

  // Restore production container provider
  setContainerProvider(new ProductionContainerProvider());
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
