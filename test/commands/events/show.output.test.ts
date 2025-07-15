import type { MockedObject } from 'vitest';

import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events show output', () => {
  let mockCalendarService: MockedObject<ICalendarService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockCalendarService = mocks.calendarService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('format output tests', () => {
    beforeEach(() => {
      const testEvent = {
        attendees: [
          {
            displayName: 'Alice Johnson',
            email: 'alice@example.com',
            responseStatus: 'accepted',
          },
          {
            email: 'bob@example.com',
            responseStatus: 'tentative',
          },
        ],
        created: '2024-01-01T08:00:00.000Z',
        creator: {
          displayName: 'Event Creator',
          email: 'creator@example.com',
        },
        description: 'This is a detailed description of the test event',
        end: { dateTime: '2024-06-25T11:00:00+09:00' },
        htmlLink: 'https://calendar.google.com/event?eid=test123',
        id: 'test-event-123',
        location: 'Conference Room A, Building 1',
        organizer: {
          displayName: 'Meeting Organizer',
          email: 'organizer@example.com',
        },
        start: { dateTime: '2024-06-25T10:00:00+09:00' },
        status: 'confirmed',
        summary: 'Important Test Meeting',
        updated: '2024-01-02T09:30:00.000Z',
      };
      mockCalendarService.getEvent.mockResolvedValue(testEvent);
    });

    it('should display event details in table format by default', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123');

      // Status messages should go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching event details...');

      // Event details should be in stdout
      expect(stdout).toContain('=== Event Details ===');
      expect(stdout).toContain('Title: Important Test Meeting');
      expect(stdout).toContain('ID: test-event-123');
      expect(stdout).toContain('Description: This is a detailed description of the test event');
      expect(stdout).toContain('Location: Conference Room A, Building 1');
      expect(stdout).toContain('Status: confirmed');
      expect(stdout).toContain('Creator: Event Creator');
      expect(stdout).toContain('Organizer: Meeting Organizer');
      expect(stdout).toContain('Attendees:');
      expect(stdout).toContain('1. Alice Johnson (accepted)');
      expect(stdout).toContain('2. bob@example.com (tentative)');
      expect(stdout).toContain('Google Calendar Link: https://calendar.google.com/event?eid=test123');

      // Status messages should NOT be in stdout
      expect(stdout).not.toContain('Authenticating with Google Calendar...');
      expect(stdout).not.toContain('Fetching event details...');
    });

    it('should output minified JSON with --format json', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123 --format json');

      // Status messages still go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching event details...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
      const event = JSON.parse(stdout);

      // Verify event data
      expect(event).toHaveProperty('id', 'test-event-123');
      expect(event).toHaveProperty('summary', 'Important Test Meeting');
      expect(event).toHaveProperty('description', 'This is a detailed description of the test event');
      expect(event).toHaveProperty('location', 'Conference Room A, Building 1');
      expect(event).toHaveProperty('status', 'confirmed');
      expect(event.attendees).toHaveLength(2);
      expect(event.creator).toHaveProperty('displayName', 'Event Creator');
      expect(event.organizer).toHaveProperty('displayName', 'Meeting Organizer');

      // Should be minified (no indentation)
      expect(stdout).not.toContain('\n  ');
      expect(stdout.trim().split('\n')).toHaveLength(1);

      // No status messages should contaminate JSON output
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Fetching');
    });

    it('should output formatted JSON with --format pretty-json', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123 --format pretty-json');

      // Status messages still go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching event details...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
      const event = JSON.parse(stdout);

      // Verify event data
      expect(event).toHaveProperty('id', 'test-event-123');
      expect(event).toHaveProperty('summary', 'Important Test Meeting');
      expect(event).toHaveProperty('description', 'This is a detailed description of the test event');
      expect(event).toHaveProperty('location', 'Conference Room A, Building 1');
      expect(event.attendees).toHaveLength(2);

      // Should be formatted (with indentation)
      expect(stdout).toContain('\n  ');
      expect(stdout.trim().split('\n').length).toBeGreaterThan(1);

      // Should start with object bracket and proper indentation
      expect(stdout.trim()).toMatch(/^{\s*\n\s+"/);

      // No status messages should contaminate JSON output
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Fetching');
    });

    it('should produce same data in json and pretty-json formats', async () => {
      const { stdout: jsonOutput } = await runCommand('events show test-event-123 --format json');
      const { stdout: prettyJsonOutput } = await runCommand('events show test-event-123 --format pretty-json');

      // Both should be valid JSON
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
      expect(() => JSON.parse(prettyJsonOutput)).not.toThrow();

      // Parse both outputs
      const jsonEvent = JSON.parse(jsonOutput);
      const prettyJsonEvent = JSON.parse(prettyJsonOutput);

      // Should contain exactly the same data
      expect(jsonEvent).toEqual(prettyJsonEvent);
      expect(jsonEvent).toHaveProperty('id', 'test-event-123');
      expect(prettyJsonEvent).toHaveProperty('summary', 'Important Test Meeting');

      // But the string representations should be different
      expect(jsonOutput).not.toEqual(prettyJsonOutput);

      // json should be minified, pretty-json should be formatted
      expect(jsonOutput).not.toContain('\n  ');
      expect(prettyJsonOutput).toContain('\n  ');
    });
  });

  describe('stdout/stderr separation', () => {
    beforeEach(() => {
      const simpleEvent = {
        end: { dateTime: '2024-06-25T11:00:00+09:00' },
        id: 'simple-event',
        start: { dateTime: '2024-06-25T10:00:00+09:00' },
        summary: 'Simple Event',
      };
      mockCalendarService.getEvent.mockResolvedValue(simpleEvent);
    });

    it('should send status messages to stderr and results to stdout', async () => {
      const { stderr, stdout } = await runCommand('events show simple-event');

      // Status messages should be in stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching event details...');

      // Results should be in stdout
      expect(stdout).toContain('=== Event Details ===');
      expect(stdout).toContain('Simple Event');

      // Cross-contamination check
      expect(stdout).not.toContain('Authenticating with Google Calendar...');
      expect(stderr).not.toContain('=== Event Details ===');
    });

    it('should produce clean JSON output for piping', async () => {
      const { stdout } = await runCommand('events show simple-event --format json');

      // Should be parseable JSON without any extra text
      expect(() => JSON.parse(stdout)).not.toThrow();

      const event = JSON.parse(stdout);
      expect(event).toBeTypeOf('object');
      expect(event).toHaveProperty('id', 'simple-event');

      // Should not contain any status messages
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Fetching');
    });
  });
});
