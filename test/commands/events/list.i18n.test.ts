import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TOKENS } from '../../../src/di/tokens';
import { I18nService } from '../../../src/services/i18n';
import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events list i18n integration', () => {
  beforeEach(() => {
    TestContainerFactory.cleanup(); // Clean up any previous state
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('English translation (default)', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();

      // Replace mock i18n service with real one set to English
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Set up empty events response for "No upcoming events found" test
      mocks.calendarService.listEvents.mockResolvedValue([]);
    });

    it('should display authentication message in English', async () => {
      const { stderr } = await runCommand('events list');

      expect(stderr).toContain('Authenticating with Google Calendar...');
    });

    it('should display fetching message in English', async () => {
      const { stderr } = await runCommand('events list');

      expect(stderr).toContain('Fetching events from primary...');
    });

    it('should display "No upcoming events found" message in English', async () => {
      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('No upcoming events found.');
    });

    it('should display events table header in English with event count', async () => {
      const { mocks } = TestContainerFactory.create();

      // Replace mock i18n service with real one
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Set up events response with data
      mocks.calendarService.listEvents.mockResolvedValue([
        {
          id: 'test-event-1',
          summary: 'Test Meeting',
          start: { dateTime: '2024-06-25T10:00:00Z' },
          end: { dateTime: '2024-06-25T11:00:00Z' },
        },
        {
          id: 'test-event-2',
          summary: 'Another Meeting',
          start: { dateTime: '2024-06-25T14:00:00Z' },
          end: { dateTime: '2024-06-25T15:00:00Z' },
        },
      ]);

      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('Upcoming Events (2 found):');
    });

    it('should display "(No title)" in English for events without summary', async () => {
      const { mocks } = TestContainerFactory.create();

      // Replace mock i18n service with real one
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Set up event without summary
      mocks.calendarService.listEvents.mockResolvedValue([
        {
          id: 'test-event-no-title',
          summary: '', // Empty summary to trigger "No title" translation
          start: { dateTime: '2024-06-25T10:00:00Z' },
          end: { dateTime: '2024-06-25T11:00:00Z' },
        },
      ]);

      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('(No title)');
    });
  });

  describe('Japanese translation', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create();

      // Replace mock i18n service with real one and change to Japanese
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Set up empty events response for "No upcoming events found" test
      mocks.calendarService.listEvents.mockResolvedValue([]);
    });

    it('should display authentication message in Japanese', async () => {
      const { stderr } = await runCommand('events list');

      expect(stderr).toContain('Google Calendar で認証中...');
    });

    it('should display fetching message in Japanese', async () => {
      const { stderr } = await runCommand('events list');

      expect(stderr).toContain('primary から予定を取得中...');
    });

    it('should display "No upcoming events found" message in Japanese', async () => {
      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('今後の予定は見つかりませんでした。');
    });

    it('should display events table header in Japanese with event count', async () => {
      const { mocks } = TestContainerFactory.create();

      // Replace mock i18n service with real one set to Japanese
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Set up events response with data
      mocks.calendarService.listEvents.mockResolvedValue([
        {
          id: 'test-event-1',
          summary: 'テストミーティング',
          start: { dateTime: '2024-06-25T10:00:00Z' },
          end: { dateTime: '2024-06-25T11:00:00Z' },
        },
        {
          id: 'test-event-2',
          summary: 'もう一つのミーティング',
          start: { dateTime: '2024-06-25T14:00:00Z' },
          end: { dateTime: '2024-06-25T15:00:00Z' },
        },
      ]);

      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('今後の予定 (2件):');
    });

    it('should display "(No title)" in Japanese for events without summary', async () => {
      const { mocks } = TestContainerFactory.create();

      // Replace mock i18n service with real one set to Japanese
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Set up event without summary
      mocks.calendarService.listEvents.mockResolvedValue([
        {
          id: 'test-event-no-title',
          summary: '', // Empty summary to trigger "No title" translation
          start: { dateTime: '2024-06-25T10:00:00Z' },
          end: { dateTime: '2024-06-25T11:00:00Z' },
        },
      ]);

      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('(タイトルなし)');
    });
  });
});
