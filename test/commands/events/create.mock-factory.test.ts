import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TOKENS } from '../../../src/di/tokens';
import { I18nService } from '../../../src/services/i18n';
import { TestContainerFactory } from '../../../src/test-utils/mock-factories';

describe('events create with Mock Factory', () => {
  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('should call CalendarService#createEvent with correct parameters for meeting + start time', async () => {
    // Arrange: Create container with calendar service mock
    const { mocks } = TestContainerFactory.createSuccessful({
      calendarService: {
        createEventResponse: {
          id: 'test-event-123',
          summary: 'Team Meeting',
          start: { dateTime: '2024-01-15T14:00:00.000Z' },
          end: { dateTime: '2024-01-15T15:00:00.000Z' },
          htmlLink: 'https://calendar.google.com/event?eid=test-123',
        },
      },
    });

    // Act: Run the command with meeting name and start time
    await runCommand('events create "Team Meeting" --start "2024-01-15T14:00:00"');

    // Assert: Verify createEvent was called with correct parameters
    expect(mocks.calendarService.createEvent.calledOnce).to.be.true;

    const createEventCall = mocks.calendarService.createEvent.getCall(0);
    const params = createEventCall.args[0];

    expect(params).to.deep.include({
      summary: 'Team Meeting',
      calendarId: 'primary',
      sendUpdates: 'none',
    });

    // Verify start time is correctly parsed (adjust for timezone conversion)
    const expectedStartTime = new Date('2024-01-15T14:00:00').toISOString();
    expect(params.start).to.deep.equal({
      dateTime: expectedStartTime,
    });

    // Verify end time is calculated (default 1 hour duration)
    const expectedEndTime = new Date(expectedStartTime);
    expectedEndTime.setHours(expectedEndTime.getHours() + 1);
    expect(params.end).to.deep.equal({
      dateTime: expectedEndTime.toISOString(),
    });
  });

  it('should display network error message when CalendarService#createEvent fails', async () => {
    // Arrange: Create container with calendar service that throws network error
    const networkError = new Error('Network request failed: ENOTFOUND calendar.googleapis.com');
    const { mocks } = TestContainerFactory.create({
      calendarService: {
        errors: {
          createEvent: networkError,
        },
      },
    });

    // Set up real i18n service for proper translation
    const realI18nService = new I18nService();
    TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

    // Act: Run the command and capture the error
    const result = await runCommand('events create "Important Meeting" --start "2024-01-15T14:00:00"');

    // Assert: Verify createEvent was called and error handling occurred
    expect(mocks.calendarService.createEvent.calledOnce).to.be.true;

    // Verify error was properly caught and displayed
    expect(result.error).to.exist;
    expect(result.error?.message).to.contain('Failed to create event');
    expect(result.error?.message).to.contain('Network request failed');
  });

  it('should display API error message when CalendarService#createEvent fails with Google API error', async () => {
    // Arrange: Create container with calendar service that throws API error
    const apiError = new Error('Request had insufficient authentication scopes.');
    const { mocks } = TestContainerFactory.create({
      calendarService: {
        errors: {
          createEvent: apiError,
        },
      },
    });

    const realI18nService = new I18nService();
    TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

    // Act: Run the command and capture the error
    const result = await runCommand('events create "Team Sync" --start "2024-01-15T09:00:00"');

    // Assert: Verify createEvent was called and error handling occurred
    expect(mocks.calendarService.createEvent.calledOnce).to.be.true;

    // Verify error was properly caught and displayed
    expect(result.error).to.exist;
    expect(result.error?.message).to.contain('Failed to create event');
    expect(result.error?.message).to.contain('insufficient authentication scopes');
  });

  it('should handle quota exceeded error gracefully', async () => {
    // Arrange: Create container with calendar service that throws quota error
    const quotaError = new Error(
      "Quota exceeded for quota metric 'Calendar usage' and limit 'Calendar usage per minute'",
    );
    const { mocks } = TestContainerFactory.create({
      calendarService: {
        errors: {
          createEvent: quotaError,
        },
      },
    });

    const realI18nService = new I18nService();
    TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

    // Act: Run the command and capture the error
    const result = await runCommand('events create "Project Review" --start "2024-01-15T16:00:00" --duration 120');

    // Assert: Verify createEvent was called and error handling occurred
    expect(mocks.calendarService.createEvent.calledOnce).to.be.true;

    // Verify error was properly caught and displayed
    expect(result.error).to.exist;
    expect(result.error?.message).to.contain('Failed to create event');
    expect(result.error?.message).to.contain('Quota exceeded');
  });

  describe('error output behavior', () => {
    it('should show status messages before network error occurs', async () => {
      // Arrange: Create container with calendar service that throws network error
      const networkError = new Error('Connection timeout');
      TestContainerFactory.create({
        calendarService: {
          errors: {
            createEvent: networkError,
          },
        },
      });

      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Act: Run the command and capture all output
      const result = await runCommand('events create "Meeting" --start "2024-01-15T14:00:00"');

      // Assert: Verify status messages appear in stderr before error
      expect(result.error).to.exist;
      expect(result.error?.message).to.contain('Failed to create event');
      expect(result.error?.message).to.contain('Connection timeout');
    });

    it('should suppress status messages with --quiet flag even when error occurs', async () => {
      // Arrange: Create container with calendar service that throws error
      const error = new Error('Service temporarily unavailable');
      TestContainerFactory.create({
        calendarService: {
          errors: {
            createEvent: error,
          },
        },
      });

      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Act: Run the command with --quiet flag
      const result = await runCommand('events create "Meeting" --start "2024-01-15T14:00:00" --quiet');

      // Assert: Error message should still appear (always shown) but status messages suppressed
      expect(result.error).to.exist;
      expect(result.error?.message).to.contain('Failed to create event');
      expect(result.error?.message).to.contain('Service temporarily unavailable');
    });

    it('should handle calendar service error before authentication completes', async () => {
      // Arrange: Create container where calendar service fails immediately
      const authError = new Error('Authentication failed: invalid_grant');
      TestContainerFactory.create({
        calendarService: {
          errors: {
            createEvent: authError,
          },
        },
      });

      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Act: Run the command
      const result = await runCommand('events create "Daily Standup" --start "2024-01-15T10:00:00"');

      // Assert: Should still call createEvent and handle auth error properly
      expect(result.error).to.exist;
      expect(result.error?.message).to.contain('Failed to create event');
      expect(result.error?.message).to.contain('Authentication failed');
    });
  });
});
