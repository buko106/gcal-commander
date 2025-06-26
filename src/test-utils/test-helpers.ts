import { calendar_v3 as calendarV3 } from 'googleapis';

import { createMockCalendarService, MockCalendarService } from './mock-factories';
import { createTestContainer, createTestContainerWithCalendarService, TestContainerContext } from './test-container-builder';
import { generateTestEvents, TEST_EVENTS } from './test-data-defaults';

/**
 * Common test scenarios for easy setup
 */
export const testScenarios = {
  /**
   * Empty state - no events or calendars
   */
  emptyState: () => createTestContainerWithCalendarService(
    createMockCalendarService({
      events: [],
      calendars: [],
    })
  ),

  /**
   * Default state with standard mock events
   */
  defaultState: () => createTestContainer(),

  /**
   * Unicode/internationalization testing
   */
  unicodeState: () => createTestContainerWithCalendarService(
    createMockCalendarService({
      events: [
        TEST_EVENTS.UNICODE_EVENT,
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
      ],
    })
  ),

  /**
   * Mixed event types (datetime, all-day, no title, etc.)
   */
  mixedEventsState: () => createTestContainerWithCalendarService(
    createMockCalendarService({
      events: [
        TEST_EVENTS.DETAILED_EVENT,
        TEST_EVENTS.ALL_DAY_EVENT,
        TEST_EVENTS.NO_TITLE_EVENT,
        TEST_EVENTS.LONG_DESCRIPTION_EVENT,
      ],
    })
  ),

  /**
   * Large dataset for performance/pagination testing
   */
  largeDatasetState: (count: number = 15) => createTestContainerWithCalendarService(
    createMockCalendarService({
      events: generateTestEvents(count),
    })
  ),

  /**
   * Authentication error scenario
   */
  authErrorState: () => createTestContainerWithCalendarService(
    createMockCalendarService({
      shouldThrowError: 'auth',
    })
  ),

  /**
   * Network error scenario
   */
  networkErrorState: () => createTestContainerWithCalendarService(
    createMockCalendarService({
      shouldThrowError: 'network',
    })
  ),
};

/**
 * Common test data generators
 */
export const TestDataGenerators = {
  /**
   * Create events with attendees for testing attendee display
   */
  eventsWithAttendees: (count: number = 2): calendarV3.Schema$Event[] => [
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
  ].slice(0, count),

  /**
   * Create events with complex data for JSON formatting tests
   */
  complexEvents: (): calendarV3.Schema$Event[] => [
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
  ],
};

/**
 * Migration helper: wrapper to maintain compatibility with existing test patterns
 * This allows gradual migration from setupTestContainer/cleanupTestContainer
 */
export function setupTestContainerV2(): {
  cleanup: () => void;
  mockCalendarService: MockCalendarService;
} {
  const context = createTestContainer();
  
  if (!context.mockCalendarService) {
    throw new Error('Mock calendar service not available in test context');
  }

  return {
    mockCalendarService: context.mockCalendarService,
    cleanup: () => context.cleanup(),
  };
}

/**
 * Helper for setting up specific test scenarios with cleanup
 */
export function setupTestScenario<T extends keyof typeof testScenarios>(
  scenario: T
): {
  cleanup: () => void;
  context: TestContainerContext;
} {
  const context = testScenarios[scenario]();
  
  return {
    context,
    cleanup: () => context.cleanup(),
  };
}

/**
 * Quick helper for tests that need custom events
 */
export function setupTestWithEvents(
  events: calendarV3.Schema$Event[]
): {
  cleanup: () => void;
  mockCalendarService: MockCalendarService;
} {
  const context = createTestContainerWithCalendarService(
    createMockCalendarService({ events })
  );

  if (!context.mockCalendarService) {
    throw new Error('Mock calendar service not available in test context');
  }

  return {
    mockCalendarService: context.mockCalendarService,
    cleanup: () => context.cleanup(),
  };
}