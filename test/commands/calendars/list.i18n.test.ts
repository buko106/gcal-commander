import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TOKENS } from '../../../src/di/tokens';
import { I18nService } from '../../../src/services/i18n';
import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('calendars/list i18n integration', () => {
  describe('English translation (default)', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.listCalendars.resolves([]);
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display status messages in English', async () => {
      const { stderr } = await runCommand(['calendars:list']);

      expect(stderr).to.include('Authenticating with Google Calendar...');
      expect(stderr).to.include('Fetching calendars...');
    });

    it('should display no calendars message in English', async () => {
      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).to.include('No calendars found.');
    });

    it('should display table header in English with calendar count', async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      const mockCalendars = [
        { id: 'cal1', summary: 'Calendar 1', accessRole: 'owner' },
        { id: 'cal2', summary: 'Calendar 2', accessRole: 'reader' },
      ];
      mocks.calendarService.listCalendars.resolves(mockCalendars);

      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).to.include('Available Calendars (2 found):');
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
      mocks.calendarService.listCalendars.resolves(mockCalendars);

      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).to.include('(Primary)');
      expect(stdout).to.include('ID:');
      expect(stdout).to.include('Access:');
      expect(stdout).to.include('Description:');
      expect(stdout).to.include('Color:');
    });
  });

  describe('Japanese translation', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.listCalendars.resolves([]);
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display status messages in Japanese', async () => {
      const { stderr } = await runCommand(['calendars:list']);

      expect(stderr).to.include('Google Calendar で認証中...');
      expect(stderr).to.include('カレンダーを取得中...');
    });

    it('should display no calendars message in Japanese', async () => {
      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).to.include('カレンダーが見つかりませんでした。');
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
      mocks.calendarService.listCalendars.resolves(mockCalendars);

      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).to.include('利用可能なカレンダー (2件):');
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
      mocks.calendarService.listCalendars.resolves(mockCalendars);

      const { stdout } = await runCommand(['calendars:list']);

      expect(stdout).to.include('(メイン)');
      expect(stdout).to.include('ID:');
      expect(stdout).to.include('アクセス:');
      expect(stdout).to.include('説明:');
      expect(stdout).to.include('色:');
    });
  });
});
