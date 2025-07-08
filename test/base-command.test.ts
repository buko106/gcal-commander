import { runCommand } from '@oclif/test';
import { expect } from 'chai';
import * as sinon from 'sinon';

import type { II18nService } from '../src/interfaces/services';

import { TOKENS } from '../src/di/tokens';
import { I18nServiceMockFactory, TestContainerFactory } from './test-utils/mock-factories';

describe('BaseCommand i18n support', () => {
  let mockI18nService: II18nService & sinon.SinonStubbedInstance<II18nService>;

  beforeEach(() => {
    TestContainerFactory.create();

    // This test needs a mocked I18nService to verify internal behavior
    mockI18nService = I18nServiceMockFactory.create();
    TestContainerFactory.registerService(TOKENS.I18nService, mockI18nService);
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('i18n initialization', () => {
    it('should initialize i18n service when initI18nService is called', async () => {
      // Test with init command which calls initI18nService
      await runCommand('init');

      expect(mockI18nService.init.called).to.be.true;
    });
  });

  describe('translation method', () => {
    it('should provide t() method and delegate to i18n service', async () => {
      mockI18nService.t.returns('translated text');

      // Test through init command which now uses t() method
      await runCommand('init');

      // Verify that t() method was called for translation keys
      expect(mockI18nService.t.called).to.be.true;
      const translationCalls = mockI18nService.t.getCalls();
      const translationKeys = translationCalls.map((call) => call.args[0]);
      expect(translationKeys).to.include('init.messages.status');
      expect(translationKeys).to.include('init.messages.confirm');
    });
  });
});
