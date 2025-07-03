import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TOKENS } from '../../src/di/tokens';
import { I18nService } from '../../src/services/i18n';
import { TestContainerFactory } from '../../src/test-utils/mock-factories/test-container-factory';

describe('init command i18n integration', () => {
  beforeEach(() => {
    TestContainerFactory.cleanup(); // Clean up any previous state
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('Japanese translation', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      
      // Replace mock i18n service with real one
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      
      // Set up mocks for Japanese test
      mocks.promptService.select.resolves('ja');
      mocks.promptService.confirm.resolves(false); // Skip auth verification
    });

    it('should display messages in Japanese when language is selected', async () => {
      const { stderr } = await runCommand('init');

      // Should display Japanese translations
      expect(stderr).to.include('Google Calendar の認証を確認します。');
    });

    it('should display status messages in Japanese', async () => {
      const { stderr } = await runCommand('init');

      // Should display Japanese status message
      expect(stderr).to.include('Google Calendar の認証を確認します。');
    });

    it('should display authentication verification message in Japanese', async () => {
      const { mocks } = TestContainerFactory.create();
      
      // Replace mock i18n service with real one
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      
      // Set up mocks for Japanese test with authentication
      mocks.promptService.select.resolves('ja');
      mocks.promptService.confirm.resolves(true); // User confirms to proceed
      mocks.calendarService.listCalendars.resolves([]);
      
      const { stderr } = await runCommand('init');

      // Should display Japanese authentication verification message
      expect(stderr).to.include('Google Calendar の認証を確認中...');
    });
  });

  describe('English translation', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      
      // Replace mock i18n service with real one
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      
      // Set up mocks for English test
      mocks.promptService.select.resolves('en');
      mocks.promptService.confirm.resolves(false); // Skip auth verification
    });

    it('should display messages in English by default', async () => {
      const { stderr } = await runCommand('init');

      // Should display English translations
      expect(stderr).to.include('This will verify your Google Calendar authentication.');
    });

    it('should display authentication verification message in English', async () => {
      const { mocks } = TestContainerFactory.create();
      
      // Replace mock i18n service with real one
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      
      // Set up mocks for English test with authentication
      mocks.promptService.select.resolves('en');
      mocks.promptService.confirm.resolves(true); // User confirms to proceed
      mocks.calendarService.listCalendars.resolves([]);
      
      const { stderr } = await runCommand('init');

      // Should display English authentication verification message
      expect(stderr).to.include('Verifying Google Calendar authentication...');
    });
  });
});