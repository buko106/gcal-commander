import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TOKENS } from '../../../src/di/tokens';
import { I18nService } from '../../../src/services/i18n';
import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('calendars/list i18n integration', () => {
  describe('English translation (default)', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.listCalendars.mockResolvedValue([]);
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display status messages in English', async () => {
      const { stderr } = await runCommand(['calendars:list']);

      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching calendars...');
    });

    it('should display no calendars message in English', async () => {
      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).toContain('No calendars found.');
    });

    it('should display table header in English with calendar count', async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      const mockCalendars = [
        { id: 'cal1', summary: 'Calendar 1', accessRole: 'owner' },
        { id: 'cal2', summary: 'Calendar 2', accessRole: 'reader' },
      ];
      mocks.calendarService.listCalendars.mockResolvedValue(mockCalendars);

      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).toContain('Available Calendars (2 found):');
    });

    it('should display calendar labels in English', async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      const mockCalendars = [
        {
          id: 'primary',
          summary: 'My Calendar',
          accessRole: 'owner',
          primary: true,
          description: 'Primary calendar',
          backgroundColor: '#3174ad',
        },
      ];
      mocks.calendarService.listCalendars.mockResolvedValue(mockCalendars);

      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).toContain('(Primar');
      expect(stdout).toContain('Name');
      expect(stdout).toContain('ID');
      expect(stdout).toContain('Access');
      expect(stdout).toContain('Description');
      expect(stdout).toContain('Color');
    });
  });

  describe('Japanese translation', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.listCalendars.mockResolvedValue([]);
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display status messages in Japanese', async () => {
      const { stderr } = await runCommand(['calendars:list']);

      expect(stderr).toContain('Google Calendar で認証中...');
      expect(stderr).toContain('カレンダーを取得中...');
    });

    it('should display no calendars message in Japanese', async () => {
      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).toContain('カレンダーが見つかりませんでした。');
    });

    it('should display table header in Japanese with calendar count', async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      const mockCalendars = [
        { id: 'cal1', summary: 'Calendar 1', accessRole: 'owner' },
        { id: 'cal2', summary: 'Calendar 2', accessRole: 'reader' },
      ];
      mocks.calendarService.listCalendars.mockResolvedValue(mockCalendars);

      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).toContain('利用可能なカレンダー (2件):');
    });

    it('should display calendar labels in Japanese', async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      const mockCalendars = [
        {
          id: 'primary',
          summary: 'My Calendar',
          accessRole: 'owner',
          primary: true,
          description: 'Primary calendar',
          backgroundColor: '#3174ad',
        },
      ];
      mocks.calendarService.listCalendars.mockResolvedValue(mockCalendars);

      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).toContain('(メイン)');
      expect(stdout).toContain('ID');
      expect(stdout).toContain('アクセス');
      expect(stdout).toContain('説明');
      expect(stdout).toContain('色');
    });
  });
});
