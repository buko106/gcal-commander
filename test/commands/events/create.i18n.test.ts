import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TOKENS } from '../../../src/di/tokens';
import { I18nService } from '../../../src/services/i18n';
import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events create i18n integration', () => {
  describe('English translation (default)', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.resolves({
        id: 'test-event-123',
        summary: 'Team Meeting',
        start: { dateTime: '2024-01-15T14:00:00.000Z' },
        end: { dateTime: '2024-01-15T15:00:00.000Z' },
        htmlLink: 'https://calendar.google.com/event?eid=test-123',
      });
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display authentication message in English', async () => {
      const { stderr } = await runCommand('events create "Team Meeting" --start "2024-01-15T14:00:00"');

      expect(stderr).to.include('Authenticating with Google Calendar...');
    });

    it('should display creating event message in English', async () => {
      const { stderr } = await runCommand('events create "Team Meeting" --start "2024-01-15T14:00:00"');

      expect(stderr).to.include('Creating event...');
    });

    it('should display success message in English', async () => {
      const { stdout } = await runCommand('events create "Team Meeting" --start "2024-01-15T14:00:00"');

      expect(stdout).to.include('Event created successfully!');
      expect(stdout).to.include('Title: Team Meeting');
      expect(stdout).to.include('ID: test-event-123');
      expect(stdout).to.include('Google Calendar Link:');
    });
  });

  describe('Japanese translation', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.resolves({
        id: 'test-event-123',
        summary: 'チーム会議',
        start: { dateTime: '2024-01-15T14:00:00.000Z' },
        end: { dateTime: '2024-01-15T15:00:00.000Z' },
        htmlLink: 'https://calendar.google.com/event?eid=test-123',
      });
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display authentication message in Japanese', async () => {
      const { stderr } = await runCommand('events create "チーム会議" --start "2024-01-15T14:00:00"');

      expect(stderr).to.include('Google Calendar で認証中...');
    });

    it('should display creating event message in Japanese', async () => {
      const { stderr } = await runCommand('events create "チーム会議" --start "2024-01-15T14:00:00"');

      expect(stderr).to.include('イベントを作成中...');
    });

    it('should display success message in Japanese', async () => {
      const { stdout } = await runCommand('events create "チーム会議" --start "2024-01-15T14:00:00"');

      expect(stdout).to.include('イベントが正常に作成されました！');
      expect(stdout).to.include('タイトル: チーム会議');
      expect(stdout).to.include('ID: test-event-123');
      expect(stdout).to.include('Google Calendar リンク:');
    });
  });

  describe('error handling i18n', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.rejects(new Error('Network error'));
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display error message in English with proper formatting', async () => {
      const result = await runCommand('events create "Test Event" --start "2024-01-15T14:00:00"');

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('Failed to create event');
      expect(result.error?.message).to.include('Network error');
    });
  });

  describe('Japanese error handling', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.rejects(new Error('ネットワークエラー'));
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display error message with Japanese context', async () => {
      const result = await runCommand('events create "テストイベント" --start "2024-01-15T14:00:00"');

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('イベントの作成に失敗しました');
      expect(result.error?.message).to.include('ネットワークエラー');
    });
  });

  describe('Flag validation error messages', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.resolves({
        id: 'test-event-123',
        summary: 'Test Event',
        start: { dateTime: '2024-01-15T14:00:00.000Z' },
        end: { dateTime: '2024-01-15T15:00:00.000Z' },
      });
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display translated error for conflicting flags in English', async () => {
      const result = await runCommand(
        'events create "Test Event" --start "2024-01-15T14:00:00" --end "2024-01-15T15:00:00" --duration 60',
      );

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('Cannot specify both --end and --duration flags');
    });

    it('should use translation key for conflicting flags error in Japanese', async () => {
      // Set up Japanese translation
      TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      const result = await runCommand(
        'events create "Test Event" --start "2024-01-15T14:00:00" --end "2024-01-15T15:00:00" --duration 60',
      );

      expect(result.error).to.exist;
      // Should show Japanese translation, not English hardcoded text
      expect(result.error?.message).to.include('--end と --duration フラグを同時に指定することはできません');
      expect(result.error?.message).to.not.include('Cannot specify both --end and --duration flags');
    });
  });
});
