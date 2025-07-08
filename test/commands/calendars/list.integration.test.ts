import type * as sinon from 'sinon';

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('calendars list integration', () => {
  let mockCalendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;

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

      mockCalendarService.listCalendars.resolves(manyCalendars);

      const { stderr, stdout } = await runCommand('calendars list');

      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching calendars...');
      expect(stdout).to.contain('Available Calendars (50 found)');
      expect(stdout).to.contain('1. Calendar 1 (Primary)');
      expect(stdout).to.contain('50. Calendar 50');

      // Verify some random entries to ensure all are displayed
      expect(stdout).to.contain('25. Calendar 25');
      expect(stdout).to.contain('calendar-24@example.com'); // 0-indexed
    });

    it('should produce valid JSON for large datasets', async () => {
      const manyCalendars = Array.from({ length: 100 }, (_, i) => ({
        accessRole: 'reader',
        id: `cal-${i}@test.com`,
        summary: `Test Calendar ${i}`,
      }));

      mockCalendarService.listCalendars.resolves(manyCalendars);

      const { stdout } = await runCommand('calendars list --format json');

      expect(() => JSON.parse(stdout)).to.not.throw();
      const calendars = JSON.parse(stdout);
      expect(calendars).to.have.length(100);
      expect(calendars[0]).to.have.property('summary', 'Test Calendar 0');
      expect(calendars[99]).to.have.property('summary', 'Test Calendar 99');
    });
  });

  describe('real-world data patterns', () => {
    it('should handle typical Google Calendar scenarios', async () => {
      mockCalendarService.listCalendars.resolves([
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

      expect(stdout).to.contain('Available Calendars (5 found)');
      expect(stdout).to.contain('1. user@gmail.com (Primary)');
      expect(stdout).to.contain('2. Contacts');
      expect(stdout).to.contain('3. Holidays in United States');
      expect(stdout).to.contain('4. Family Calendar');
      expect(stdout).to.contain('5. Team Calendar');

      // Check access roles are displayed
      expect(stdout).to.contain('Access: owner');
      expect(stdout).to.contain('Access: reader');
      expect(stdout).to.contain('Access: writer');

      // Check colors are displayed
      expect(stdout).to.contain('Color: #039be5');
      expect(stdout).to.contain('Color: #d50000');

      // Check descriptions
      expect(stdout).to.contain('Birthdays and events from your contacts');
      expect(stdout).to.contain('Shared family events and activities');
    });

    it('should handle Unicode and international calendar names', async () => {
      mockCalendarService.listCalendars.resolves([
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

      expect(stdout).to.contain('仕事のカレンダー');
      expect(stdout).to.contain('🎉 イベント & パーティー 🎊');
      expect(stdout).to.contain('Arbeitskalender für München');
      expect(stdout).to.contain('تقويم العمل');
      expect(stdout).to.contain('会議とプロジェクトの予定');
      expect(stdout).to.contain('楽しいイベントの計画 🎈');
      expect(stdout).to.contain('Termine und Besprechungen in München');
      expect(stdout).to.contain('اجتماعات ومواعيد العمل');
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle calendars with null/undefined properties gracefully', async () => {
      mockCalendarService.listCalendars.resolves([
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

      expect(stdout).to.contain('Available Calendars (2 found)');
      expect(stdout).to.contain('1. Partial Calendar');
      expect(stdout).to.contain('2. (No name)');
      expect(stdout).to.contain('ID: partial@example.com');
      expect(stdout).to.contain('ID: null-props@example.com');
    });

    it('should handle calendars with extremely long IDs', async () => {
      const longId = 'very.long.calendar.id.that.might.break.formatting@' + 'a'.repeat(100) + '.example.com';
      mockCalendarService.listCalendars.resolves([
        {
          accessRole: 'owner',
          id: longId,
          summary: 'Calendar with Long ID',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain('Calendar with Long ID');
      expect(stdout).to.contain(`ID: ${longId}`);
    });
  });

  describe('consistency across formats', () => {
    beforeEach(() => {
      mockCalendarService.listCalendars.resolves([
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
      expect(calendars).to.have.length(2);

      // Verify key information appears in both formats
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const primaryCalendar = calendars.find((cal: any) => cal.primary);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const secondaryCalendar = calendars.find((cal: any) => !cal.primary);

      expect(primaryCalendar).to.exist;
      expect(secondaryCalendar).to.exist;

      // Check table format contains the same information
      expect(tableOutput).to.contain('Primary Calendar');
      expect(tableOutput).to.contain('Secondary Calendar');
      expect(tableOutput).to.contain('primary');
      expect(tableOutput).to.contain('secondary@example.com');
      expect(tableOutput).to.contain('owner');
      expect(tableOutput).to.contain('reader');
      expect(tableOutput).to.contain('#1a73e8');
      expect(tableOutput).to.contain('My main calendar');

      // Verify JSON contains complete data
      expect(primaryCalendar.id).to.equal('primary');
      expect(primaryCalendar.summary).to.equal('Primary Calendar');
      expect(primaryCalendar.accessRole).to.equal('owner');
      expect(primaryCalendar.backgroundColor).to.equal('#1a73e8');
      expect(primaryCalendar.description).to.equal('My main calendar');

      expect(secondaryCalendar.id).to.equal('secondary@example.com');
      expect(secondaryCalendar.summary).to.equal('Secondary Calendar');
      expect(secondaryCalendar.accessRole).to.equal('reader');
    });
  });
});
