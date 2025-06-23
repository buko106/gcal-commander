import { calendar_v3 as calendarV3 } from 'googleapis';

/**
 * Test data sets for calendar testing
 */
export const CalendarTestData = {
  /**
   * Edge cases - calendars with unusual properties
   */
  edgeCases: {
    calendars: [
      {
        // No summary - should show "(No name)"
        accessRole: 'reader',
        id: 'no-name@example.com',
      },
      {
        accessRole: '',
        backgroundColor: '',
        description: '',
        id: 'empty-strings@example.com',
        summary: '',
      },
      {
        accessRole: 'owner',
        description: 'B'.repeat(500), // Very long description
        id: 'long-name@example.com',
        summary: 'A'.repeat(200), // Very long name
      },
      {
        accessRole: 'writer',
        backgroundColor: '#ff6b6b',
        description: 'Contains 日本語, العربية, and other ñøñ-ASCII characters 🎉',
        id: 'special-chars@example.com',
        summary: '📅 Calendar with émojis & spëcial chars',
      },
      {
        accessRole: 'reader',
        id: 'very.long.calendar.id.that.might.break.formatting@extremely.long.domain.name.example.com',
        summary: 'Calendar with Extremely Long ID',
      },
    ] as calendarV3.Schema$CalendarListEntry[],
  },

  /**
   * Empty dataset - no calendars
   */
  empty: {
    calendars: [] as calendarV3.Schema$CalendarListEntry[],
  },

  /**
   * International calendars - different languages and cultures
   */
  international: {
    calendars: [
      {
        accessRole: 'owner',
        backgroundColor: '#8e24aa',
        description: '会議とプロジェクトの予定',
        id: 'japanese@example.com',
        summary: '仕事のカレンダー',
      },
      {
        accessRole: 'writer',
        backgroundColor: '#e91e63',
        description: '楽しいイベントの計画 🎈',
        id: 'emoji@example.com',
        summary: '🎉 イベント & パーティー 🎊',
      },
      {
        accessRole: 'reader',
        backgroundColor: '#ff9800',
        description: 'Termine und Besprechungen in München',
        id: 'german@example.com',
        summary: 'Arbeitskalender für München',
      },
      {
        accessRole: 'writer',
        backgroundColor: '#4caf50',
        description: 'اجتماعات ومواعيد العمل',
        id: 'arabic@example.com',
        summary: 'تقويم العمل',
      },
      {
        accessRole: 'owner',
        backgroundColor: '#2196f3',
        description: '会议和项目安排',
        id: 'chinese@example.com',
        summary: '工作日程',
      },
    ] as calendarV3.Schema$CalendarListEntry[],
  },

  /**
   * Minimal dataset - single primary calendar
   */
  minimal: {
    calendars: [
      {
        accessRole: 'owner',
        id: 'primary',
        primary: true,
        summary: 'Primary Calendar',
      },
    ] as calendarV3.Schema$CalendarListEntry[],
  },

  /**
   * Typical user dataset - realistic calendar setup
   */
  typical: {
    calendars: [
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
        id: 'family@group.calendar.google.com',
        summary: 'Family Calendar',
      },
    ] as calendarV3.Schema$CalendarListEntry[],
  },
};

/**
 * Generate a large number of calendars for performance testing
 */
export function generateMockCalendars(count: number): calendarV3.Schema$CalendarListEntry[] {
  const accessRoles = ['owner', 'writer', 'reader'] as const;
  const colors = ['#1a73e8', '#d50000', '#f4511e', '#0b8043', '#8e24aa', '#e91e63'];
  
  return Array.from({ length: count }, (_, i) => ({
    accessRole: accessRoles[i % accessRoles.length],
    backgroundColor: colors[i % colors.length],
    description: i % 3 === 0 ? `Description for generated calendar ${i + 1}` : undefined,
    id: `generated-calendar-${i}@example.com`,
    primary: i === 0, // First one is primary
    summary: `Generated Calendar ${i + 1}`,
  }));
}

/**
 * Create calendar with specific properties for targeted testing
 */
export function createTestCalendar(overrides: Partial<calendarV3.Schema$CalendarListEntry> = {}): calendarV3.Schema$CalendarListEntry {
  return {
    accessRole: 'owner',
    backgroundColor: '#1a73e8',
    description: 'A test calendar for unit testing',
    id: 'test@example.com',
    primary: false,
    summary: 'Test Calendar',
    ...overrides,
  };
}

/**
 * Calendar data with null/undefined values for testing robustness
 */
export const CalendarNullTestData = {
  calendars: [
    {
      accessRole: 'reader',
      id: 'null-summary@example.com',
      primary: false,
      summary: null,
    },
    {
      id: 'undefined-props@example.com',
      summary: 'Calendar with undefined properties',
      // Intentionally omitting optional properties
    },
    {
      accessRole: null,
      backgroundColor: null,
      description: null,
      id: 'mixed-null@example.com',
      primary: null,
      summary: 'Mixed Null Properties',
    },
  ] as calendarV3.Schema$CalendarListEntry[],
};