import { calendar_v3 as calendarV3 } from 'googleapis';

/**
 * Default test data for calendar events
 */
export const DEFAULT_MOCK_EVENTS: calendarV3.Schema$Event[] = [
  {
    end: { dateTime: '2024-01-01T11:00:00Z' },
    id: 'mock-event-1',
    start: { dateTime: '2024-01-01T10:00:00Z' },
    summary: 'Mock Event 1',
  },
  {
    end: { dateTime: '2024-01-02T15:00:00Z' },
    id: 'mock-event-2',
    start: { dateTime: '2024-01-02T14:00:00Z' },
    summary: 'Mock Event 2',
  },
];

/**
 * Default test data for calendar list entries
 */
export const DEFAULT_MOCK_CALENDARS: calendarV3.Schema$CalendarListEntry[] = [
  {
    id: 'primary',
    primary: true,
    summary: 'Primary Calendar',
  },
  {
    id: 'mock-calendar-2',
    primary: false,
    summary: 'Secondary Calendar',
  },
];

/**
 * Additional test events for various scenarios
 */
export const TEST_EVENTS = {
  /**
   * Event with detailed information for comprehensive testing
   */
  DETAILED_EVENT: {
    attendees: [
      { email: 'alice@example.com', responseStatus: 'accepted' },
      { email: 'bob@example.com', responseStatus: 'tentative' },
    ],
    description: 'Important client meeting to discuss project updates and timeline',
    end: { dateTime: '2024-06-25T11:00:00Z' },
    id: 'detailed-event',
    location: 'Conference Room A',
    start: { dateTime: '2024-06-25T10:00:00Z' },
    summary: 'Meeting with client',
  },

  /**
   * All-day event for testing date-only scenarios
   */
  ALL_DAY_EVENT: {
    description: 'Annual company holiday - office closed',
    end: { date: '2024-06-27' },
    id: 'all-day-event',
    start: { date: '2024-06-26' },
    summary: 'Company Holiday',
  },

  /**
   * Event without title for edge case testing
   */
  NO_TITLE_EVENT: {
    end: { dateTime: '2024-06-27T15:30:00Z' },
    id: 'no-title-event',
    start: { dateTime: '2024-06-27T14:30:00Z' },
    // Note: No summary to test "(No title)" handling
  },

  /**
   * Event with Unicode characters and emojis
   */
  UNICODE_EVENT: {
    description: '重要な会議です。資料を準備してください。',
    end: { dateTime: '2024-06-25T11:00:00Z' },
    id: 'unicode-event',
    location: '東京オフィス 🏢',
    start: { dateTime: '2024-06-25T10:00:00Z' },
    summary: '会議 📅',
  },

  /**
   * Event with long description for truncation testing
   */
  LONG_DESCRIPTION_EVENT: {
    description: 'This is a very long description that exceeds 100 characters and should be truncated in the table view to maintain readability and proper formatting of the output display',
    end: { dateTime: '2024-06-28T10:00:00Z' },
    id: 'long-description-event',
    start: { dateTime: '2024-06-28T09:00:00Z' },
    summary: 'Event with long description',
  },
};

/**
 * Generate multiple test events for bulk testing
 */
export function generateTestEvents(count: number): calendarV3.Schema$Event[] {
  return Array.from({ length: count }, (_, i) => ({
    end: { dateTime: `2024-06-${25 + Math.floor(i / 10)}T${11 + i % 10}:00:00Z` },
    id: `generated-event-${i}`,
    start: { dateTime: `2024-06-${25 + Math.floor(i / 10)}T${10 + i % 10}:00:00Z` },
    summary: `Generated Event ${i + 1}`,
  }));
}