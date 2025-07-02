import { runCommand } from '@oclif/test';
import { expect } from 'chai';
import * as sinon from 'sinon';

import type { IAuthService, ICalendarService, IPromptService } from '../../src/interfaces/services';

import { TestContainerFactory } from '../../src/test-utils/mock-factories/test-container-factory';

describe('init command', () => {
  let mockPromptService: IPromptService & sinon.SinonStubbedInstance<IPromptService>;
  let mockAuthService: IAuthService & sinon.SinonStubbedInstance<IAuthService>;
  let mockCalendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockPromptService = mocks.promptService;
    mockAuthService = mocks.authService;
    mockCalendarService = mocks.calendarService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
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