import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TOKENS } from '../../../src/di/tokens';
import { I18nService } from '../../../src/services/i18n';
import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events create i18n integration', () => {
  describe('English translation (default)', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.mockResolvedValue({
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

      expect(stderr).toContain('Authenticating with Google Calendar...');
    });

    it('should display creating event message in English', async () => {
      const { stderr } = await runCommand('events create "Team Meeting" --start "2024-01-15T14:00:00"');

      expect(stderr).toContain('Creating event...');
    });

    it('should display success message in English', async () => {
      const { stdout } = await runCommand('events create "Team Meeting" --start "2024-01-15T14:00:00"');

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Team Meeting');
      expect(stdout).toContain('ID: test-event-123');
      expect(stdout).toContain('Google Calendar Link:');
    });
  });

  describe('Japanese translation', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.mockResolvedValue({
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

      expect(stderr).toContain('Google Calendar で認証中...');
    });

    it('should display creating event message in Japanese', async () => {
      const { stderr } = await runCommand('events create "チーム会議" --start "2024-01-15T14:00:00"');

      expect(stderr).toContain('イベントを作成中...');
    });

    it('should display success message in Japanese', async () => {
      const { stdout } = await runCommand('events create "チーム会議" --start "2024-01-15T14:00:00"');

      expect(stdout).toContain('イベントが正常に作成されました！');
      expect(stdout).toContain('タイトル: チーム会議');
      expect(stdout).toContain('ID: test-event-123');
      expect(stdout).toContain('Google Calendar リンク:');
    });
  });

  describe('error handling i18n', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.mockRejectedValue(new Error('Network error'));
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display error message in English with proper formatting', async () => {
      const result = await runCommand('events create "Test Event" --start "2024-01-15T14:00:00"');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Failed to create event');
      expect(result.error?.message).toContain('Network error');
    });
  });

  describe('Japanese error handling', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.mockRejectedValue(new Error('ネットワークエラー'));
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display error message with Japanese context', async () => {
      const result = await runCommand('events create "テストイベント" --start "2024-01-15T14:00:00"');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('イベントの作成に失敗しました');
      expect(result.error?.message).toContain('ネットワークエラー');
    });
  });

  describe('Flag validation error messages', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      mocks.calendarService.createEvent.mockResolvedValue({
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

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Cannot specify both --end and --duration flags');
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

      expect(result.error).toBeDefined();
      // Should show Japanese translation, not English hardcoded text
      expect(result.error?.message).toContain('--end と --duration フラグを同時に指定することはできません');
      expect(result.error?.message).not.toContain('Cannot specify both --end and --duration flags');
    });
  });
});
