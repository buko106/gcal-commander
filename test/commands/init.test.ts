import type { MockedObject } from 'vitest';

import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  IAuthService,
  ICalendarService,
  IConfigService,
  II18nService,
  IPromptService,
} from '../../src/interfaces/services';

import { TOKENS } from '../../src/di/tokens';
import { I18nServiceMockFactory, TestContainerFactory } from '../test-utils/mock-factories';

describe('init command', () => {
  let mockPromptService: MockedObject<IPromptService>;
  let mockAuthService: MockedObject<IAuthService>;
  let mockCalendarService: MockedObject<ICalendarService>;
  let mockI18nService: MockedObject<II18nService>;
  let mockConfigService: IConfigService;
  let configServiceSpy: unknown;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockPromptService = mocks.promptService;
    mockAuthService = mocks.authService;
    mockCalendarService = mocks.calendarService;
    mockConfigService = mocks.configService;
    configServiceSpy = vi.spyOn(mockConfigService, 'set');

    // This test needs a mocked I18nService to set up translation responses
    mockI18nService = I18nServiceMockFactory.create();
    TestContainerFactory.registerService(TOKENS.I18nService, mockI18nService);

    // Set up i18n mock return values
    mockI18nService.t.mockImplementation((key: string, options?: unknown) => {
      if (key === 'init.messages.status') return 'This will verify your Google Calendar authentication.';
      if (key === 'init.messages.confirm') return 'Do you want to verify authentication?';
      if (key === 'init.messages.cancelled') return 'Operation cancelled.';
      if (key === 'init.messages.success') return 'Authentication successful!';
      if (key === 'init.messages.verifying') return 'Verifying Google Calendar authentication...';
      if (key.includes('init.messages.authenticationFailed')) {
        return `Authentication failed: ${options?.error}\nTry running the command again or check your Google Calendar API credentials.`;
      }

      return key;
    });
  });

  afterEach(() => {
    configServiceSpy?.mockRestore();
    TestContainerFactory.cleanup();
  });

  describe('language selection', () => {
    it('should prompt for language selection before authentication', async () => {
      mockPromptService.select.mockResolvedValue('ja');
      mockPromptService.confirm.mockResolvedValue(true);

      await runCommand('init');

      expect(mockPromptService.select).toHaveBeenCalled();
      expect(mockPromptService.select.mock.calls[0][0]).toContain('language');
      expect(mockI18nService.changeLanguage).toHaveBeenCalled();
      expect(mockI18nService.changeLanguage.mock.calls[0][0]).toEqual('ja');
    });

    it('should set English as default when user selects English', async () => {
      mockPromptService.select.mockResolvedValue('en');
      mockPromptService.confirm.mockResolvedValue(false);

      await runCommand('init');

      expect(mockI18nService.changeLanguage).toHaveBeenCalled();
      expect(mockI18nService.changeLanguage.mock.calls[0][0]).toEqual('en');
    });

    it('should initialize i18n service before language selection', async () => {
      mockPromptService.select.mockResolvedValue('en');
      mockPromptService.confirm.mockResolvedValue(false);

      await runCommand('init');

      expect(mockI18nService.init).toHaveBeenCalled();
      expect(mockI18nService.changeLanguage).toHaveBeenCalled();
    });

    it('should save selected language to config', async () => {
      mockPromptService.select.mockResolvedValue('ja');
      mockPromptService.confirm.mockResolvedValue(false);

      await runCommand('init');

      expect(configServiceSpy).toHaveBeenCalled();
      expect(configServiceSpy.mock.calls[0][0]).toEqual('language');
      expect(configServiceSpy.mock.calls[0][1]).toEqual('ja');
    });
  });

  it('should display confirmation message when user confirms', async () => {
    mockPromptService.confirm.mockResolvedValue(true);

    const { stdout, stderr } = await runCommand('init');

    expect(stderr).toContain('This will verify your Google Calendar authentication.');
    expect(stderr).toContain('Verifying Google Calendar authentication...');
    expect(stdout).toContain('Authentication successful!');
  });

  it('should display cancellation message when user declines', async () => {
    mockPromptService.confirm.mockResolvedValue(false);

    const { stdout, stderr } = await runCommand('init');

    expect(stderr).toContain('This will verify your Google Calendar authentication.');
    expect(stdout).toContain('Operation cancelled.');
  });

  it('should use default value (yes) when no input provided', async () => {
    // Default behavior from factory should be true
    const { stdout, stderr } = await runCommand('init');

    expect(stderr).toContain('This will verify your Google Calendar authentication.');
    expect(stderr).toContain('Verifying Google Calendar authentication...');
    expect(stdout).toContain('Authentication successful!');
  });

  describe('authentication verification', () => {
    it('should verify Google Calendar authentication when user confirms', async () => {
      mockPromptService.confirm.mockResolvedValue(true);
      // Mock successful authentication
      mockAuthService.getCalendarAuth.mockResolvedValue({
        client: {
          credentials: {
            // eslint-disable-next-line camelcase
            access_token: 'mock-access-token',
            // eslint-disable-next-line camelcase
            refresh_token: 'mock-refresh-token',
          },
        },
      });

      const { stdout, stderr } = await runCommand('init');

      expect(stderr).toContain('This will verify your Google Calendar authentication.');
      expect(stderr).toContain('Verifying Google Calendar authentication...');
      expect(stdout).toContain('Authentication successful!');
    });

    it('should handle authentication failure gracefully', async () => {
      mockPromptService.confirm.mockResolvedValue(true);
      // Mock authentication failure
      mockCalendarService.listCalendars.mockRejectedValue(new Error('Authentication failed: Invalid credentials'));

      const { stdout, stderr } = await runCommand('init');

      expect(stderr).toContain('This will verify your Google Calendar authentication.');
      expect(stderr).toContain('Verifying Google Calendar authentication...');
      expect(stdout).toContain('Authentication failed: Authentication failed: Invalid credentials');
    });

    it('should not attempt authentication when user declines', async () => {
      mockPromptService.confirm.mockResolvedValue(false);

      const { stdout } = await runCommand('init');

      expect(stdout).toContain('Operation cancelled.');
      expect(mockCalendarService.listCalendars).not.toHaveBeenCalled();
    });
  });
});
