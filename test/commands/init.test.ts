import { runCommand } from '@oclif/test';
import { expect } from 'chai';
import * as sinon from 'sinon';

import type { IAuthService, ICalendarService, IConfigService, II18nService, IPromptService } from '../../src/interfaces/services';

import { TestContainerFactory } from '../../src/test-utils/mock-factories/test-container-factory';

describe('init command', () => {
  let mockPromptService: IPromptService & sinon.SinonStubbedInstance<IPromptService>;
  let mockAuthService: IAuthService & sinon.SinonStubbedInstance<IAuthService>;
  let mockCalendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;
  let mockI18nService: II18nService & sinon.SinonStubbedInstance<II18nService>;
  let mockConfigService: IConfigService;
  let configServiceSpy: sinon.SinonSpy;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockPromptService = mocks.promptService;
    mockAuthService = mocks.authService;
    mockCalendarService = mocks.calendarService;
    mockI18nService = mocks.i18nService;
    mockConfigService = mocks.configService;
    configServiceSpy = sinon.spy(mockConfigService, 'set');
    
    // Set up i18n mock return values
    mockI18nService.t.withArgs('commands:init.messages.status').returns('This will verify your Google Calendar authentication.');
    mockI18nService.t.withArgs('commands:init.messages.confirm').returns('Do you want to verify authentication?');
    mockI18nService.t.withArgs('commands:init.messages.cancelled').returns('Operation cancelled.');
    mockI18nService.t.withArgs('commands:init.messages.success').returns('Authentication successful!');
    mockI18nService.t.withArgs('commands:init.messages.verifying').returns('Verifying Google Calendar authentication...');
  });

  afterEach(() => {
    configServiceSpy?.restore();
    TestContainerFactory.cleanup();
  });

  describe('language selection', () => {
    it('should prompt for language selection before authentication', async () => {
      mockPromptService.select.resolves('ja');
      mockPromptService.confirm.resolves(true);

      await runCommand('init');

      expect(mockPromptService.select.called).to.be.true;
      expect(mockPromptService.select.getCall(0).args[0]).to.contain('language');
      expect(mockI18nService.changeLanguage.called).to.be.true;
      expect(mockI18nService.changeLanguage.getCall(0).args[0]).to.equal('ja');
    });

    it('should set English as default when user selects English', async () => {
      mockPromptService.select.resolves('en');
      mockPromptService.confirm.resolves(false);

      await runCommand('init');

      expect(mockI18nService.changeLanguage.called).to.be.true;
      expect(mockI18nService.changeLanguage.getCall(0).args[0]).to.equal('en');
    });

    it('should initialize i18n service before language selection', async () => {
      mockPromptService.select.resolves('en');
      mockPromptService.confirm.resolves(false);

      await runCommand('init');

      expect(mockI18nService.init.called).to.be.true;
      expect(mockI18nService.init.calledBefore(mockI18nService.changeLanguage)).to.be.true;
    });

    it('should save selected language to config', async () => {
      mockPromptService.select.resolves('ja');
      mockPromptService.confirm.resolves(false);

      await runCommand('init');

      expect(configServiceSpy.called).to.be.true;
      expect(configServiceSpy.getCall(0).args[0]).to.equal('language');
      expect(configServiceSpy.getCall(0).args[1]).to.equal('ja');
    });
  });

  it('should display confirmation message when user confirms', async () => {
    mockPromptService.confirm.resolves(true);

    const { stdout, stderr } = await runCommand('init');

    expect(stderr).to.contain('This will verify your Google Calendar authentication.');
    expect(stderr).to.contain('Verifying Google Calendar authentication...');
    expect(stdout).to.contain('Authentication successful!');
  });

  it('should display cancellation message when user declines', async () => {
    mockPromptService.confirm.resolves(false);

    const { stdout, stderr } = await runCommand('init');

    expect(stderr).to.contain('This will verify your Google Calendar authentication.');
    expect(stdout).to.contain('Operation cancelled.');
  });

  it('should use default value (yes) when no input provided', async () => {
    // Default behavior from factory should be true
    const { stdout, stderr } = await runCommand('init');

    expect(stderr).to.contain('This will verify your Google Calendar authentication.');
    expect(stderr).to.contain('Verifying Google Calendar authentication...');
    expect(stdout).to.contain('Authentication successful!');
  });

  describe('authentication verification', () => {
    it('should verify Google Calendar authentication when user confirms', async () => {
      mockPromptService.confirm.resolves(true);
      // Mock successful authentication
      mockAuthService.getCalendarAuth.resolves({
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

      expect(stderr).to.contain('This will verify your Google Calendar authentication.');
      expect(stderr).to.contain('Verifying Google Calendar authentication...');
      expect(stdout).to.contain('Authentication successful!');
    });

    it('should handle authentication failure gracefully', async () => {
      mockPromptService.confirm.resolves(true);
      // Mock authentication failure
      mockCalendarService.listCalendars.rejects(
        new Error('Authentication failed: Invalid credentials')
      );

      const { stdout, stderr } = await runCommand('init');

      expect(stderr).to.contain('This will verify your Google Calendar authentication.');
      expect(stderr).to.contain('Verifying Google Calendar authentication...');
      expect(stdout).to.contain('Authentication failed: Authentication failed: Invalid credentials');
    });

    it('should not attempt authentication when user declines', async () => {
      mockPromptService.confirm.resolves(false);

      const { stdout } = await runCommand('init');

      expect(stdout).to.contain('Operation cancelled.');
      expect(mockCalendarService.listCalendars.called).to.be.false;
    });
  });
});