import 'reflect-metadata';
import * as sinon from 'sinon';
import { container, DependencyContainer } from 'tsyringe';

import { setContainerProvider } from '../../di/container-provider';
import { ProductionContainerProvider } from '../../di/production-container-provider';
import { setTestContainer } from '../../di/test-container';
import { TestContainerProvider } from '../../di/test-container-provider';
import { TOKENS } from '../../di/tokens';
import { IAuthService, ICalendarService } from '../../interfaces/services';
import { MockAuthService } from '../mock-services';
import { CalendarServiceMockFactory, CalendarServiceMockOptions } from './calendar-service-mock-factory';

export interface TestContainerOptions {
  authService?: IAuthService;
  calendarService?: CalendarServiceMockOptions;
}

/**
 * Factory for creating test containers with service-specific mock configurations
 * Provides clean separation of concerns and explicit mock setup
 */
export class TestContainerFactory {
  private static currentContainer: DependencyContainer | null = null;

  /**
   * Clean up the current test container
   */
  static cleanup(): void {
    if (this.currentContainer) {
      this.currentContainer.clearInstances();
      this.currentContainer = null;
    }
    
    // Clear the test container reference
    setTestContainer(null as unknown as DependencyContainer);
    
    // Restore production container provider
    setContainerProvider(new ProductionContainerProvider());
  }

  /**
   * Create a test container with specified mock configurations
   */
  static create(options: TestContainerOptions = {}): {
    container: DependencyContainer;
    mocks: {
      authService: IAuthService;
      calendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;
    };
  } {
    // Clean up any existing container
    this.cleanup();

    // Create child container for test isolation
    this.currentContainer = container.createChildContainer();
    
    // Set the container for the existing DI system
    setTestContainer(this.currentContainer);

    // Create mocks
    const calendarServiceMock = CalendarServiceMockFactory.create(options.calendarService);
    const authServiceMock = options.authService || new MockAuthService();

    // Register mocks in container
    this.currentContainer.register<ICalendarService>(TOKENS.CalendarService, {
      useValue: calendarServiceMock,
    });

    this.currentContainer.register<IAuthService>(TOKENS.AuthService, {
      useValue: authServiceMock,
    });

    // Set the test container provider
    setContainerProvider(new TestContainerProvider());

    return {
      container: this.currentContainer,
      mocks: {
        calendarService: calendarServiceMock,
        authService: authServiceMock,
      },
    };
  }

  /**
   * Create a test container with successful mock behaviors (default scenario)
   */
  static createSuccessful(options: TestContainerOptions = {}): {
    container: DependencyContainer;
    mocks: {
      authService: IAuthService;
      calendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;
    };
  } {
    const calendarOptions = options.calendarService || {};
    const successfulOptions: TestContainerOptions = {
      ...options,
      calendarService: calendarOptions,
    };

    const result = this.create(successfulOptions);
    
    // Ensure default successful behaviors
    if (!calendarOptions.events && !calendarOptions.errors?.listEvents) {
      // Use factory's default successful behavior
    }

    return result;
  }

  /**
   * Get the current test container (for advanced usage)
   */
  static getCurrentContainer(): DependencyContainer {
    if (!this.currentContainer) {
      throw new Error('Test container not initialized. Call TestContainerFactory.create() first.');
    }

    return this.currentContainer;
  }

  /**
   * Register additional service in current container
   */
  static registerService<T>(token: string, service: T): void {
    if (!this.currentContainer) {
      throw new Error('Test container not initialized. Call TestContainerFactory.create() first.');
    }

    this.currentContainer.register<T>(token, { useValue: service });
  }
}