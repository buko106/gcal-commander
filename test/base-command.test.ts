import { runCommand } from '@oclif/test';
import { expect } from 'chai';
import * as sinon from 'sinon';

import type { II18nService } from '../src/interfaces/services';
import { TestContainerFactory } from '../src/test-utils/mock-factories/test-container-factory';

describe('BaseCommand i18n support', () => {
  let mockI18nService: II18nService & sinon.SinonStubbedInstance<II18nService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockI18nService = mocks.i18nService;
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
      const translationKeys = translationCalls.map(call => call.args[0]);
      expect(translationKeys).to.include('commands:init.messages.status');
      expect(translationKeys).to.include('commands:init.messages.confirm');
    });
  });
});