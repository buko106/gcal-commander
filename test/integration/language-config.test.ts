import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TOKENS } from '../../src/di/tokens';
import { I18nService } from '../../src/services/i18n';
import { TestContainerFactory } from '../../src/test-utils/mock-factories/test-container-factory';

describe('Language Configuration Integration', () => {
  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('should use saved language setting for commands', async () => {
    // Set up test environment with Japanese language saved in config
    const { mocks } = TestContainerFactory.create();
    const realI18nService = new I18nService();
    TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
    
    // Mock config storage to return config with Japanese language setting
    mocks.configStorage.read.resolves(JSON.stringify({ language: 'ja' }));
    mocks.configStorage.exists.resolves(true);
    mocks.calendarService.listCalendars.resolves([]);

    const { stderr } = await runCommand(['calendars:list']);
    
    // Should display Japanese message because language is set to 'ja' in config
    expect(stderr).to.include('Google Calendar で認証中...');
    expect(stderr).to.include('カレンダーを取得中...');
  });

  it('should default to English when no language is saved in config', async () => {
    // Set up test environment with no language setting in config
    const { mocks } = TestContainerFactory.create();
    const realI18nService = new I18nService();
    TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
    
    // Mock config storage to return empty config
    mocks.configStorage.read.resolves(JSON.stringify({}));
    mocks.configStorage.exists.resolves(true);
    mocks.calendarService.listCalendars.resolves([]);

    const { stderr } = await runCommand(['calendars:list']);
    
    // Should display English message because no language is set in config
    expect(stderr).to.include('Authenticating with Google Calendar...');
    expect(stderr).to.include('Fetching calendars...');
  });
});