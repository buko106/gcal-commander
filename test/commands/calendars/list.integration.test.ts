import type { MockedObject } from 'vitest';

import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('calendars list integration', () => {
  let mockCalendarService: ICalendarService & MockedObject<ICalendarService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockCalendarService = mocks.calendarService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('large dataset scenarios', () => {
    it('should handle displaying many calendars efficiently', async () => {
      // Create 50 calendars to test performance and formatting
      const manyCalendars = Array.from({ length: 50 }, (_, i) => ({
        accessRole: ['owner', 'writer', 'reader'][i % 3] as string,
        backgroundColor: i % 5 === 0 ? `#${Math.random().toString(16).slice(2, 8)}` : undefined,
        description: i % 3 === 0 ? `Description for calendar ${i + 1}` : undefined,
        id: `calendar-${i}@example.com`,
        primary: i === 0,
        summary: `Calendar ${i + 1}`,
      }));

      mockCalendarService.listCalendars.mockResolvedValue(manyCalendars);

      const { stderr, stdout } = await runCommand('calendars list');

      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching calendars...');
      expect(stdout).toContain('Available Calendars (50 found)');
      expect(stdout).toContain('Calendar 1');
      expect(stdout).toContain('✓');
      expect(stdout).toContain('Calendar 50');

      // Verify some random entries to ensure all are displayed
      expect(stdout).toContain('Calendar 25');
      expect(stdout).toContain('calendar-24@example.com'); // 0-indexed
    });

    it('should produce valid JSON for large datasets', async () => {
      const manyCalendars = Array.from({ length: 100 }, (_, i) => ({
        accessRole: 'reader',
        id: `cal-${i}@test.com`,
        summary: `Test Calendar ${i}`,
      }));

      mockCalendarService.listCalendars.mockResolvedValue(manyCalendars);

      const { stdout } = await runCommand('calendars list --format json');

      expect(() => JSON.parse(stdout)).not.toThrow();
      const calendars = JSON.parse(stdout);
      expect(calendars).toHaveLength(100);
      expect(calendars[0]).toHaveProperty('summary', 'Test Calendar 0');
      expect(calendars[99]).toHaveProperty('summary', 'Test Calendar 99');
    });
  });

  describe('real-world data patterns', () => {
    it('should handle typical Google Calendar scenarios', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          backgroundColor: '#039be5',
          id: 'primary',
          primary: true,
          summary: 'user@gmail.com',
        },
        {
          accessRole: 'reader',
          backgroundColor: '#616161',
          description: 'Birthdays and events from your contacts',
          id: 'addressbook#contacts@group.v.calendar.google.com',
          summary: 'Contacts',
        },
        {
          accessRole: 'reader',
          backgroundColor: '#0b8043',
          id: 'en.usa#holiday@group.v.calendar.google.com',
          summary: 'Holidays in United States',
        },
        {
          accessRole: 'writer',
          backgroundColor: '#d50000',
          description: 'Shared family events and activities',
          id: 'family12345@group.calendar.google.com',
          summary: 'Family Calendar',
        },
        {
          accessRole: 'reader',
          backgroundColor: '#f4511e',
          description: 'Team meetings and project deadlines',
          id: 'work.team@company.com',
          summary: 'Team Calendar',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('Available Calendars (5 found)');
      expect(stdout).toContain('user@gmail.com');
      expect(stdout).toContain('✓');
      expect(stdout).toContain('Contacts');
      expect(stdout).toContain('Holidays in United Sta');
      expect(stdout).toContain('Family Calendar');
      expect(stdout).toContain('Team Calendar');

      // Check access roles are displayed
      expect(stdout).toContain('owner');
      expect(stdout).toContain('reader');
      expect(stdout).toContain('writer');

      // Check colors are displayed
      expect(stdout).toContain('#039be5');
      expect(stdout).toContain('#d50000');

      // Check descriptions
      expect(stdout).toContain('Birthdays and events from y');
      expect(stdout).toContain('Shared family events and ac');
    });

    it('should handle Unicode and international calendar names', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          description: '会議とプロジェクトの予定',
          id: 'japanese@example.com',
          summary: '仕事のカレンダー',
        },
        {
          accessRole: 'writer',
          description: '楽しいイベントの計画 🎈',
          id: 'emoji@example.com',
          summary: '🎉 イベント & パーティー 🎊',
        },
        {
          accessRole: 'reader',
          description: 'Termine und Besprechungen in München',
          id: 'german@example.com',
          summary: 'Arbeitskalender für München',
        },
        {
          accessRole: 'writer',
          description: 'اجتماعات ومواعيد العمل',
          id: 'arabic@example.com',
          summary: 'تقويم العمل',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('仕事のカレンダー');
      expect(stdout).toContain('🎉 イベント & パーティ');
      expect(stdout).toContain('Arbeitskalender für Mü');
      expect(stdout).toContain('تقويم العمل');
      expect(stdout).toContain('会議とプロジェクトの予定');
      expect(stdout).toContain('楽しいイベントの計画 🎈');
      expect(stdout).toContain('Termine und Besprechungen i');
      expect(stdout).toContain('اجتماعات ومواعيد العمل');
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle calendars with null/undefined properties gracefully', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          id: 'partial@example.com',
          summary: 'Partial Calendar',
          // Intentionally omitting optional fields to test undefined handling
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        {
          accessRole: null,
          backgroundColor: null,
          description: null,
          id: 'null-props@example.com',
          primary: null,
          summary: null,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('Available Calendars (2 found)');
      expect(stdout).toContain('Partial Calendar');
      expect(stdout).toContain('(No name)');
      expect(stdout).toContain('partial@example.com');
      expect(stdout).toContain('null-props@example.com');
    });

    it('should handle calendars with extremely long IDs', async () => {
      const longId = 'very.long.calendar.id.that.might.break.formatting@' + 'a'.repeat(100) + '.example.com';
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          id: longId,
          summary: 'Calendar with Long ID',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('Calendar with Long ID');
      expect(stdout).toContain('very.long.calendar.id.that.might');
    });
  });

  describe('consistency across formats', () => {
    beforeEach(() => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          backgroundColor: '#1a73e8',
          description: 'My main calendar',
          id: 'primary',
          primary: true,
          summary: 'Primary Calendar',
        },
        {
          accessRole: 'reader',
          id: 'secondary@example.com',
          primary: false,
          summary: 'Secondary Calendar',
        },
      ]);
    });

    it('should include same data in both table and JSON formats', async () => {
      const { stdout: tableOutput } = await runCommand('calendars list --format table');
      const { stdout: jsonOutput } = await runCommand('calendars list --format json');

      // Parse JSON output
      const calendars = JSON.parse(jsonOutput);
      expect(calendars).toHaveLength(2);

      // Verify key information appears in both formats
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const primaryCalendar = calendars.find((cal: any) => cal.primary);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const secondaryCalendar = calendars.find((cal: any) => !cal.primary);

      expect(primaryCalendar).toBeDefined();
      expect(secondaryCalendar).toBeDefined();

      // Check table format contains the same information
      expect(tableOutput).toContain('Primary Calendar');
      expect(tableOutput).toContain('Secondary Calendar');
      expect(tableOutput).toContain('primary');
      expect(tableOutput).toContain('secondary@example.com');
      expect(tableOutput).toContain('owner');
      expect(tableOutput).toContain('reader');
      expect(tableOutput).toContain('#1a73e8');
      expect(tableOutput).toContain('My main calendar');

      // Verify JSON contains complete data
      expect(primaryCalendar.id).toBe('primary');
      expect(primaryCalendar.summary).toBe('Primary Calendar');
      expect(primaryCalendar.accessRole).toBe('owner');
      expect(primaryCalendar.backgroundColor).toBe('#1a73e8');
      expect(primaryCalendar.description).toBe('My main calendar');

      expect(secondaryCalendar.id).toBe('secondary@example.com');
      expect(secondaryCalendar.summary).toBe('Secondary Calendar');
      expect(secondaryCalendar.accessRole).toBe('reader');
    });
  });
});
