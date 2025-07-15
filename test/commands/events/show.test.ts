import type { MockedObject } from 'vitest';

import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events show', () => {
  let mockCalendarService: MockedObject<ICalendarService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockCalendarService = mocks.calendarService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('requires eventId argument', async () => {
    try {
      await runCommand('events show');
      expect.fail('Should have thrown an error for missing eventId');
    } catch (error) {
      expect(String(error)).toMatch(/Missing.*required.*argument|Missing.*eventId/i);
    }
  });

  it('shows authentication message in stderr with eventId', async () => {
    // Set up a test event for the mock service
    const testEvent = {
      id: 'test-event-123',
      summary: 'Test Event',
      start: { dateTime: '2024-06-25T10:00:00+09:00' },
      end: { dateTime: '2024-06-25T11:00:00+09:00' },
    };
    mockCalendarService.getEvent.mockResolvedValue(testEvent);

    const { stderr } = await runCommand('events show test-event-123');
    expect(stderr).toContain('Authenticating with Google Calendar...');
  });

  it('accepts calendar flag', async () => {
    // Set up a test event for the mock service
    const testEvent = {
      id: 'test-event-123',
      summary: 'Test Event',
      start: { dateTime: '2024-06-25T10:00:00+09:00' },
      end: { dateTime: '2024-06-25T11:00:00+09:00' },
    };
    mockCalendarService.getEvent.mockResolvedValue(testEvent);

    const { stderr } = await runCommand('events show test-event-123 --calendar my-calendar@gmail.com');
    expect(stderr).toContain('Authenticating with Google Calendar...');
  });

  it('accepts format flag', async () => {
    // Set up a test event for the mock service
    const testEvent = {
      id: 'test-event-123',
      summary: 'Test Event',
      start: { dateTime: '2024-06-25T10:00:00+09:00' },
      end: { dateTime: '2024-06-25T11:00:00+09:00' },
    };
    mockCalendarService.getEvent.mockResolvedValue(testEvent);

    const { stderr } = await runCommand('events show test-event-123 --format json');
    expect(stderr).toContain('Authenticating with Google Calendar...');
  });

  it('rejects invalid format', async () => {
    try {
      await runCommand('events show test-event-123 --format invalid');
      expect.fail('Should have thrown an error for invalid format');
    } catch (error) {
      expect(String(error)).toMatch(/Expected.*format.*to be one of|invalid.*format/i);
    }
  });

  it('accepts pretty-json format', async () => {
    // Set up a test event for the mock service
    const testEvent = {
      id: 'test-event-123',
      summary: 'Test Event',
      start: { dateTime: '2024-06-25T10:00:00+09:00' },
      end: { dateTime: '2024-06-25T11:00:00+09:00' },
    };
    mockCalendarService.getEvent.mockResolvedValue(testEvent);

    const { stderr } = await runCommand('events show test-event-123 --format pretty-json');
    expect(stderr).toContain('Authenticating with Google Calendar...');
  });
});
