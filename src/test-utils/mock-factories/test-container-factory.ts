import 'reflect-metadata';
import * as sinon from 'sinon';
import { container, DependencyContainer } from 'tsyringe';

import { setContainerProvider } from '../../di/container-provider';
import { ProductionContainerProvider } from '../../di/production-container-provider';
import { setTestContainer } from '../../di/test-container';
import { TestContainerProvider } from '../../di/test-container-provider';
import { TOKENS } from '../../di/tokens';
import { IConfigStorage } from '../../interfaces/config-storage';
import {
  IAuthService,
  ICalendarService,
  IConfigService,
  II18nService,
  IPromptService,
} from '../../interfaces/services';
import { ConfigService } from '../../services/config';
import { I18nService } from '../../services/i18n';
import { AuthServiceMockFactory, AuthServiceMockOptions } from './auth-service-mock-factory';
import { CalendarServiceMockFactory, CalendarServiceMockOptions } from './calendar-service-mock-factory';
import { ConfigStorageMockFactory, ConfigStorageMockOptions } from './config-storage-mock-factory';
import { PromptServiceMockFactory, PromptServiceMockOptions } from './prompt-service-mock-factory';

export interface TestContainerOptions {
  authService?: AuthServiceMockOptions;
  calendarService?: CalendarServiceMockOptions;
  configStorage?: ConfigStorageMockOptions;
  promptService?: PromptServiceMockOptions;
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
      authService: IAuthService & sinon.SinonStubbedInstance<IAuthService>;
      calendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;
      configService: IConfigService;
      configStorage: IConfigStorage & sinon.SinonStubbedInstance<IConfigStorage>;
      i18nService: II18nService;
      promptService: IPromptService & sinon.SinonStubbedInstance<IPromptService>;
    };
  } {
    // Clean up any existing container
    this.cleanup();

    // Create child container for test isolation
    this.currentContainer = container.createChildContainer();

    // Set the container for the existing DI system
    setTestContainer(this.currentContainer);

    // Create mocks
    const authServiceMock = AuthServiceMockFactory.create(options.authService);
    const calendarServiceMock = CalendarServiceMockFactory.create(options.calendarService);
    const configStorageMock = ConfigStorageMockFactory.create(options.configStorage);
    const i18nService = new I18nService();
    const promptServiceMock = PromptServiceMockFactory.create(options.promptService);

    // Create ConfigService with mocked storage
    const configService = new ConfigService(configStorageMock);

    // Register mocks in container
    this.currentContainer.register<ICalendarService>(TOKENS.CalendarService, {
      useValue: calendarServiceMock,
    });

    this.currentContainer.register<IAuthService>(TOKENS.AuthService, {
      useValue: authServiceMock,
    });

    this.currentContainer.register<IConfigStorage>(TOKENS.ConfigStorage, {
      useValue: configStorageMock,
    });

    this.currentContainer.register<IConfigService>(TOKENS.ConfigService, {
      useValue: configService,
    });

    this.currentContainer.register<II18nService>(TOKENS.I18nService, {
      useValue: i18nService,
    });

    this.currentContainer.register<IPromptService>(TOKENS.PromptService, {
      useValue: promptServiceMock,
    });

    // Set the test container provider
    setContainerProvider(new TestContainerProvider());

    return {
      container: this.currentContainer,
      mocks: {
        authService: authServiceMock,
        calendarService: calendarServiceMock,
        configService,
        configStorage: configStorageMock,
        i18nService,
        promptService: promptServiceMock,
      },
    };
  }

  /**
   * Create a test container with successful mock behaviors (default scenario)
   */
  static createSuccessful(options: TestContainerOptions = {}): {
    container: DependencyContainer;
    mocks: {
      authService: IAuthService & sinon.SinonStubbedInstance<IAuthService>;
      calendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;
      configService: IConfigService;
      configStorage: IConfigStorage & sinon.SinonStubbedInstance<IConfigStorage>;
      i18nService: II18nService;
      promptService: IPromptService & sinon.SinonStubbedInstance<IPromptService>;
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
