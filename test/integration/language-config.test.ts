import { runCommand } from '@oclif/test';
import { afterEach, describe, expect, it } from 'vitest';

import { TOKENS } from '../../src/di/tokens';
import { I18nService } from '../../src/services/i18n';
import { TestContainerFactory } from '../test-utils/mock-factories';

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
    mocks.configStorage.read.mockResolvedValue(JSON.stringify({ language: 'ja' }));
    mocks.configStorage.exists.mockResolvedValue(true);
    mocks.calendarService.listCalendars.mockResolvedValue([]);

    const { stderr } = await runCommand(['calendars:list']);

    // Should display Japanese message because language is set to 'ja' in config
    expect(stderr).toContain('Google Calendar で認証中...');
    expect(stderr).toContain('カレンダーを取得中...');
  });

  it('should default to English when no language is saved in config', async () => {
    // Set up test environment with no language setting in config
    const { mocks } = TestContainerFactory.create();
    const realI18nService = new I18nService();
    TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

    // Mock config storage to return empty config
    mocks.configStorage.read.mockResolvedValue(JSON.stringify({}));
    mocks.configStorage.exists.mockResolvedValue(true);
    mocks.calendarService.listCalendars.mockResolvedValue([]);

    const { stderr } = await runCommand(['calendars:list']);

    // Should display English message because no language is set in config
    expect(stderr).toContain('Authenticating with Google Calendar...');
    expect(stderr).toContain('Fetching calendars...');
  });
});
