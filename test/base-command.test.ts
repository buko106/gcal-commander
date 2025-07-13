import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { II18nService, MockedObject } from '../src/interfaces/services';

import { BaseCommand } from '../src/base-command';
import { TOKENS } from '../src/di/tokens';
import { I18nServiceMockFactory, TestContainerFactory } from './test-utils/mock-factories';

// Test implementation of BaseCommand for testing
class TestBaseCommand extends BaseCommand {
  static description = 'Test command for BaseCommand functionality';

  // Expose protected methods for testing
  public async testInitI18nService(): Promise<void> {
    return this.initI18nService();
  }

  public testT(key: string, options?: unknown): string {
    return this.t(key, options);
  }
}

describe('BaseCommand i18n support', () => {
  let mockI18nService: MockedObject<II18nService>;
  let testCommand: TestBaseCommand;

  beforeEach(() => {
    TestContainerFactory.create();

    // This test needs mocked I18nService to verify internal behavior
    mockI18nService = I18nServiceMockFactory.create();
    TestContainerFactory.registerService(TOKENS.I18nService, mockI18nService);

    testCommand = new TestBaseCommand([], {});
    // Mock the getContainer method to return our test container
    testCommand.getContainer = vi.fn().mockReturnValue(TestContainerFactory.getCurrentContainer());
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('i18n initialization', () => {
    it('should initialize i18n service when initI18nService is called', async () => {
      await testCommand.testInitI18nService();

      expect(mockI18nService.init).toHaveBeenCalled();
    });
  });

  describe('translation method', () => {
    it('should provide t() method and delegate to i18n service', async () => {
      mockI18nService.t.mockReturnValue('translated text');

      // Initialize i18n service first
      await testCommand.testInitI18nService();

      // Test the t() method
      const result = testCommand.testT('test.key');

      expect(result).toBe('translated text');
      expect(mockI18nService.t).toHaveBeenCalledWith('test.key', undefined);
    });
  });
});
