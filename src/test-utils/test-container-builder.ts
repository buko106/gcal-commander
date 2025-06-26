import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';

import { setContainerProvider } from '../di/container-provider';
import { ProductionContainerProvider } from '../di/production-container-provider';
import { TOKENS } from '../di/tokens';
import { IAuthService, ICalendarService } from '../interfaces/services';
import { createMockAuthService, createMockCalendarService, MockAuthService, MockCalendarService } from './mock-factories';

/**
 * Custom container provider for explicit test configuration
 */
class ExplicitTestContainerProvider {
  constructor(private container: DependencyContainer) {}

  getContainer(): DependencyContainer {
    return this.container;
  }
}

/**
 * Builder for creating test containers with explicit mock configuration
 * Provides transparent and flexible test setup
 */
export class TestContainerBuilder {
  private container: DependencyContainer;
  private isActivated = false;

  constructor() {
    // Create isolated child container for this test
    this.container = container.createChildContainer();
  }

  /**
   * Activate the test container and return mock services for further configuration
   * This makes the container active for the current test
   */
  activate(): TestContainerContext {
    if (this.isActivated) {
      throw new Error('TestContainerBuilder has already been activated');
    }

    // Set the custom container provider
    setContainerProvider(new ExplicitTestContainerProvider(this.container));
    this.isActivated = true;

    // Extract registered services for test access
    const mockCalendarService = this.container.isRegistered(TOKENS.CalendarService)
      ? this.container.resolve<MockCalendarService>(TOKENS.CalendarService)
      : undefined;

    const mockAuthService = this.container.isRegistered(TOKENS.AuthService)
      ? this.container.resolve<MockAuthService>(TOKENS.AuthService)
      : undefined;

    return new TestContainerContext(
      this.container,
      mockCalendarService,
      mockAuthService
    );
  }

  /**
   * Convenience method to setup default mock services
   */
  withDefaultMocks(): this {
    return this
      .withMockCalendarService(createMockCalendarService())
      .withMockAuthService(createMockAuthService());
  }

  /**
   * Register a mock auth service with explicit configuration
   */
  withMockAuthService(service: MockAuthService): this {
    this.container.register<IAuthService>(TOKENS.AuthService, {
      useValue: service,
    });
    return this;
  }

  /**
   * Register a mock calendar service with explicit configuration
   */
  withMockCalendarService(service: MockCalendarService): this {
    this.container.register<ICalendarService>(TOKENS.CalendarService, {
      useValue: service,
    });
    return this;
  }
}

/**
 * Context object returned after activating a test container
 * Provides access to the container and registered mock services
 */
export class TestContainerContext {
  constructor(
    public readonly container: DependencyContainer,
    public readonly mockCalendarService?: MockCalendarService,
    public readonly mockAuthService?: MockAuthService
  ) {}

  /**
   * Clean up the test container and restore production settings
   * Should be called in afterEach
   */
  cleanup(): void {
    this.container.clearInstances();
    setContainerProvider(new ProductionContainerProvider());
  }
}

/**
 * Simple helper function for basic test setup
 * Creates a test container with default mocks
 */
export function createTestContainer(): TestContainerContext {
  return new TestContainerBuilder()
    .withDefaultMocks()
    .activate();
}

/**
 * Helper function to create test container with custom calendar service
 */
export function createTestContainerWithCalendarService(
  calendarService: MockCalendarService
): TestContainerContext {
  return new TestContainerBuilder()
    .withMockCalendarService(calendarService)
    .withMockAuthService(createMockAuthService())
    .activate();
}

/**
 * Helper function to create test container with custom auth service
 */
export function createTestContainerWithAuthService(
  authService: MockAuthService
): TestContainerContext {
  return new TestContainerBuilder()
    .withMockCalendarService(createMockCalendarService())
    .withMockAuthService(authService)
    .activate();
}