import type { MockedObject } from 'vitest';

import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events list integration', () => {
  let mockCalendarService: MockedObject<ICalendarService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockCalendarService = mocks.calendarService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('stdout/stderr separation', () => {
    it('should separate status messages from event data', async () => {
      const { stderr, stdout } = await runCommand('events list');

      // Status messages should go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching events from primary...');

      // Event data should go to stdout
      expect(stdout).toContain('Upcoming Events (2 found)');
      expect(stdout).toContain('Mock Event 1');
      expect(stdout).toContain('Mock Event 2');

      // Status messages should NOT be in stdout
      expect(stdout).not.toContain('Authenticating with Google Calendar...');
      expect(stdout).not.toContain('Fetching events from');
    });

    it('should produce clean JSON output for piping', async () => {
      const { stderr, stdout } = await runCommand('events list --format json');

      // Status messages still go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching events from primary...');

      // stdout should contain only clean JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
      const events = JSON.parse(stdout);
      expect(Array.isArray(events)).toBe(true);
      expect(events).toHaveLength(2);
      expect(events[0]).toHaveProperty('summary', 'Mock Event 1');
      expect(events[1]).toHaveProperty('summary', 'Mock Event 2');

      // No status messages should contaminate JSON output
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Fetching');
    });
  });

  describe('different event scenarios', () => {
    it('should handle events with various time formats', async () => {
      const mixedEvents = [
        {
          description: 'Important client meeting to discuss project updates and timeline',
          end: { dateTime: '2024-06-25T11:00:00Z' },
          id: 'datetime-event',
          location: 'Conference Room A',
          start: { dateTime: '2024-06-25T10:00:00Z' },
          summary: 'Meeting with client',
        },
        {
          description: 'Annual company holiday - office closed',
          end: { date: '2024-06-27' },
          id: 'all-day-event',
          start: { date: '2024-06-26' },
          summary: 'Company Holiday',
        },
        {
          end: { dateTime: '2024-06-27T15:30:00Z' },
          id: 'no-title-event',
          // No summary to test "(No title)" handling
          start: { dateTime: '2024-06-27T14:30:00Z' },
        },
        {
          description:
            'This is a very long description that exceeds 100 characters and should be truncated in the table view to maintain readability and proper formatting of the output display',
          end: { dateTime: '2024-06-28T10:00:00Z' },
          id: 'long-description-event',
          start: { dateTime: '2024-06-28T09:00:00Z' },
          summary: 'Event with long description',
        },
      ];

      mockCalendarService.listEvents.mockResolvedValue(mixedEvents);

      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('Upcoming Events (4 found)');
      expect(stdout).toContain('Meeting with client');
      expect(stdout).toContain('Conference Room A');
      expect(stdout).toContain('Company Holiday');
      expect(stdout).toContain('All day');
      expect(stdout).toContain('(No title)');
      expect(stdout).toContain('Event with long description');
      expect(stdout).toContain('This is a very long descrip…');
    });

    it('should handle empty events list', async () => {
      mockCalendarService.listEvents.mockResolvedValue([]);

      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('No upcoming events found.');
    });

    it('should handle events with Unicode characters', async () => {
      const unicodeEvents = [
        {
          description: '重要な会議です。資料を準備してください。',
          end: { dateTime: '2024-06-25T11:00:00Z' },
          id: 'japanese-event',
          location: '東京オフィス 🏢',
          start: { dateTime: '2024-06-25T10:00:00Z' },
          summary: '会議 📅',
        },
        {
          description: 'Celebrating with 🍰 and 🎈',
          end: { dateTime: '2024-06-26T22:00:00Z' },
          id: 'emoji-event',
          location: '🏠 Home',
          start: { dateTime: '2024-06-26T18:00:00Z' },
          summary: '🎉 Birthday Party 🎂',
        },
        {
          description: 'Diskussion über die geplanten Änderungen im System',
          end: { dateTime: '2024-06-27T15:00:00Z' },
          id: 'german-event',
          location: 'München Büro',
          start: { dateTime: '2024-06-27T14:00:00Z' },
          summary: 'Besprechung über Änderungen',
        },
      ];

      mockCalendarService.listEvents.mockResolvedValue(unicodeEvents);

      const { stdout } = await runCommand('events list');

      expect(stdout).toContain('会議 📅');
      expect(stdout).toContain('東京オフィス 🏢');
      expect(stdout).toContain('重要な会議です。資料を準備');
      expect(stdout).toContain('🎉 Birthday Party 🎂');
      expect(stdout).toContain('🏠 Home');
      expect(stdout).toContain('Celebrating with 🍰 and 🎈');
      expect(stdout).toContain('Besprechung über Änderungen');
      expect(stdout).toContain('München Büro');
    });
  });

  describe('calendar argument handling', () => {
    it('should fetch events from specified calendar', async () => {
      const { stderr } = await runCommand('events list work@company.com');

      expect(stderr).toContain('Fetching events from work@company.com...');
    });

    it('should default to primary calendar', async () => {
      const { stderr } = await runCommand('events list');

      expect(stderr).toContain('Fetching events from primary...');
    });

    it('should handle primary calendar explicitly', async () => {
      const { stderr } = await runCommand('events list primary');

      expect(stderr).toContain('Fetching events from primary...');
    });
  });

  describe('flag parameter handling', () => {
    beforeEach(() => {
      // Set up 15 events to test max-results limiting
      const manyEvents = Array.from({ length: 15 }, (_, i) => ({
        end: { dateTime: `2024-06-${25 + Math.floor(i / 10)}T${11 + (i % 10)}:00:00Z` },
        id: `event-${i}`,
        start: { dateTime: `2024-06-${25 + Math.floor(i / 10)}T${10 + (i % 10)}:00:00Z` },
        summary: `Event ${i + 1}`,
      }));
      // Use mockImplementation to respect maxResults parameter
      mockCalendarService.listEvents.mockImplementation(async (params) => manyEvents.slice(0, params.maxResults));
    });

    it('should respect max-results flag', async () => {
      const { stdout } = await runCommand('events list --max-results 5');

      expect(stdout).toContain('Upcoming Events (5 found)');
      expect(stdout).toContain('Event 1');
      expect(stdout).toContain('Event 5');
      expect(stdout).not.toContain('Event 6');
    });

    it('should respect max-results short flag', async () => {
      const { stdout } = await runCommand('events list -n 3');

      expect(stdout).toContain('Upcoming Events (3 found)');
      expect(stdout).toContain('Event 1');
      expect(stdout).toContain('Event 3');
      expect(stdout).not.toContain('Event 4');
    });

    it('should use default max-results when not specified', async () => {
      const { stdout } = await runCommand('events list');

      // Default should be 10, but we have 15 events, so should see 10
      expect(stdout).toContain('Upcoming Events (10 found)');
      expect(stdout).toContain('Event 10');
      expect(stdout).not.toContain('Event 11');
    });
  });

  describe('format consistency', () => {
    beforeEach(() => {
      const testEvents = [
        {
          attendees: [
            { email: 'alice@example.com', responseStatus: 'accepted' },
            { email: 'bob@example.com', responseStatus: 'tentative' },
          ],
          description: 'Important test meeting',
          end: { dateTime: '2024-06-25T11:00:00Z' },
          id: 'test-event-1',
          location: 'Meeting Room 1',
          start: { dateTime: '2024-06-25T10:00:00Z' },
          summary: 'Test Meeting',
        },
        {
          end: { date: '2024-06-27' },
          id: 'test-event-2',
          start: { date: '2024-06-26' },
          summary: 'All Day Event',
        },
      ];
      mockCalendarService.listEvents.mockResolvedValue(testEvents);
    });

    it('should include same events in both table and JSON formats', async () => {
      const { stdout: tableOutput } = await runCommand('events list --format table');
      const { stdout: jsonOutput } = await runCommand('events list --format json');

      // Parse JSON output
      const events = JSON.parse(jsonOutput);
      expect(events).toHaveLength(2);

      // Verify key information appears in both formats
      const firstEvent = events.find((event: any) => event.id === 'test-event-1'); // eslint-disable-line @typescript-eslint/no-explicit-any
      const secondEvent = events.find((event: any) => event.id === 'test-event-2'); // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(firstEvent).toBeDefined();
      expect(secondEvent).toBeDefined();

      // Check table format contains the same information
      expect(tableOutput).toContain('Test Meeting');
      expect(tableOutput).toContain('All Day Event');
      expect(tableOutput).toContain('Meeting Room 1');
      expect(tableOutput).toContain('Important test meeting');
      expect(tableOutput).toContain('All day');

      // Verify JSON contains complete data
      expect(firstEvent.summary).toBe('Test Meeting');
      expect(firstEvent.location).toBe('Meeting Room 1');
      expect(firstEvent.description).toBe('Important test meeting');
      expect(firstEvent.attendees).toHaveLength(2);

      expect(secondEvent.summary).toBe('All Day Event');
      expect(secondEvent.start.date).toBe('2024-06-26');

      // Should be minified JSON (no indentation)
      expect(jsonOutput).not.toContain('\n  ');
      expect(jsonOutput.trim().split('\n')).toHaveLength(1);
    });

    it('should produce formatted JSON with --format pretty-json', async () => {
      const { stderr, stdout } = await runCommand('events list --format pretty-json');

      // Status messages still go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching events from');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
      const events = JSON.parse(stdout);
      expect(events).toHaveLength(2);

      // Verify data integrity
      const firstEvent = events.find((event: any) => event.id === 'test-event-1'); // eslint-disable-line @typescript-eslint/no-explicit-any
      const secondEvent = events.find((event: any) => event.id === 'test-event-2'); // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(firstEvent).toBeDefined();
      expect(firstEvent.summary).toBe('Test Meeting');
      expect(firstEvent.location).toBe('Meeting Room 1');
      expect(firstEvent.attendees).toHaveLength(2);

      expect(secondEvent).toBeDefined();
      expect(secondEvent.summary).toBe('All Day Event');

      // Should be formatted JSON (with indentation)
      expect(stdout).toContain('\n  ');
      expect(stdout.trim().split('\n').length).toBeGreaterThan(1);

      // Should start with array bracket and proper indentation
      expect(stdout.trim()).toMatch(/^\[\s*\n\s+{/);

      // No status messages should contaminate JSON output
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Fetching');
    });

    it('should produce same data in json and pretty-json formats', async () => {
      const { stdout: jsonOutput } = await runCommand('events list --format json');
      const { stdout: prettyJsonOutput } = await runCommand('events list --format pretty-json');

      // Both should be valid JSON
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
      expect(() => JSON.parse(prettyJsonOutput)).not.toThrow();

      // Parse both outputs
      const jsonEvents = JSON.parse(jsonOutput);
      const prettyJsonEvents = JSON.parse(prettyJsonOutput);

      // Should contain exactly the same data
      expect(jsonEvents).toEqual(prettyJsonEvents);
      expect(jsonEvents).toHaveLength(2);
      expect(prettyJsonEvents).toHaveLength(2);

      // But the string representations should be different
      expect(jsonOutput).not.toEqual(prettyJsonOutput);

      // json should be minified, pretty-json should be formatted
      expect(jsonOutput).not.toContain('\n  ');
      expect(prettyJsonOutput).toContain('\n  ');
    });

    it('should produce valid JSON even with complex event data', async () => {
      const complexEvents = [
        {
          creator: {
            displayName: 'Event Creator',
            email: 'creator@example.com',
          },
          description: 'Description with\nnewlines and\ttabs',
          end: { dateTime: '2024-06-25T11:00:00Z' },
          htmlLink: 'https://calendar.google.com/event?eid=example',
          id: 'complex-event',
          location: 'Room with "special" chars & symbols',
          organizer: {
            displayName: 'Event Organizer',
            email: 'organizer@example.com',
          },
          start: { dateTime: '2024-06-25T10:00:00Z' },
          summary: 'Complex Event with "quotes" and special chars: &<>',
        },
      ];

      mockCalendarService.listEvents.mockResolvedValue(complexEvents);

      const { stdout } = await runCommand('events list --format json');

      expect(() => JSON.parse(stdout)).not.toThrow();
      const events = JSON.parse(stdout);
      expect(events).toHaveLength(1);
      expect(events[0].summary).toContain('quotes');
      expect(events[0].description).toContain('newlines');
      expect(events[0].location).toContain('special');
    });
  });

  describe('--quiet flag behavior', () => {
    it('should suppress status messages with --quiet flag', async () => {
      const { stderr, stdout } = await runCommand('events list --quiet');

      // Status messages should be suppressed
      expect(stderr).not.toContain('Authenticating with Google Calendar...');
      expect(stderr).not.toContain('Fetching events from');

      // But results should still be shown
      expect(stdout).toContain('Upcoming Events (2 found)');
      expect(stdout).toContain('Mock Event 1');
    });

    it('should suppress status messages in JSON format with --quiet flag', async () => {
      const { stderr, stdout } = await runCommand('events list --format json --quiet');

      // Status messages should be suppressed
      expect(stderr).not.toContain('Authenticating with Google Calendar...');
      expect(stderr).not.toContain('Fetching events from');

      // JSON output should still be clean and valid
      expect(() => JSON.parse(stdout)).not.toThrow();
      const events = JSON.parse(stdout);
      expect(events).toHaveLength(2);
    });
  });

  describe('--fields flag behavior', () => {
    beforeEach(() => {
      const testEvents = [
        {
          description: 'Important test meeting',
          end: { dateTime: '2024-06-25T11:00:00Z' },
          id: 'test-event-1',
          location: 'Meeting Room 1',
          start: { dateTime: '2024-06-25T10:00:00Z' },
          summary: 'Test Meeting',
        },
      ];
      mockCalendarService.listEvents.mockResolvedValue(testEvents);
    });

    it('should show only specified fields with --fields flag', async () => {
      const { stdout } = await runCommand('events list --fields=title,date');

      expect(stdout).toContain('Title');
      expect(stdout).toContain('Date');
      expect(stdout).toContain('Test Meeting');
      expect(stdout).toContain('6/25/2024');

      // These columns should NOT be present
      expect(stdout).not.toContain('Time');
      expect(stdout).not.toContain('Location');
      expect(stdout).not.toContain('Description');
    });

    it('should handle single field with --fields flag', async () => {
      const { stdout } = await runCommand('events list --fields=title');

      expect(stdout).toContain('Title');
      expect(stdout).toContain('Test Meeting');

      // These columns should NOT be present
      expect(stdout).not.toContain('Date');
      expect(stdout).not.toContain('Time');
      expect(stdout).not.toContain('Location');
      expect(stdout).not.toContain('Description');
    });

    it('should work with --fields and --format json', async () => {
      const { stdout } = await runCommand('events list --fields=title,date --format json');

      // JSON output should not be affected by --fields flag
      expect(() => JSON.parse(stdout)).not.toThrow();
      const events = JSON.parse(stdout);
      expect(events).toHaveLength(1);
      expect(events[0]).toHaveProperty('summary', 'Test Meeting');
      expect(events[0]).toHaveProperty('location', 'Meeting Room 1');
    });
  });
});
