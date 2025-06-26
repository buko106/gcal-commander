import { calendar_v3 as calendarV3 } from 'googleapis';

import { AuthResult, CreateEventParams, IAuthService, ICalendarService, ListEventsParams } from '../interfaces/services';
import { DEFAULT_MOCK_CALENDARS, DEFAULT_MOCK_EVENTS } from './test-data-defaults';

/**
 * Configuration data for MockCalendarService
 */
export interface MockCalendarServiceData {
  calendars: calendarV3.Schema$CalendarListEntry[];
  events: calendarV3.Schema$Event[];
  shouldThrowError?: 'auth' | 'network' | 'validation' | false;
}

/**
 * Configuration data for MockAuthService
 */
export interface MockAuthServiceData {
  accessToken: string;
  refreshToken: string;
  shouldThrowError?: 'auth' | 'network' | false;
}

/**
 * Mock implementation of ICalendarService that accepts immutable configuration
 */
export class MockCalendarService implements ICalendarService {
  private readonly data: MockCalendarServiceData;

  constructor(data: MockCalendarServiceData) {
    this.data = { ...data };
  }

  async createEvent(params: CreateEventParams): Promise<calendarV3.Schema$Event> {
    this.throwErrorIfConfigured();

    const newEvent: calendarV3.Schema$Event = {
      description: params.description,
      end: params.end,
      id: `mock-event-${Date.now()}`,
      location: params.location,
      start: params.start,
      summary: params.summary,
    };

    if (params.attendees?.length) {
      newEvent.attendees = params.attendees.map(email => ({ email }));
    }

    return newEvent;
  }

  async getEvent(eventId: string, _calendarId: string): Promise<calendarV3.Schema$Event> {
    this.throwErrorIfConfigured();

    const event = this.data.events.find(e => e.id === eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    return event;
  }

  async listCalendars(): Promise<calendarV3.Schema$CalendarListEntry[]> {
    this.throwErrorIfConfigured();
    return [...this.data.calendars];
  }

  async listEvents(params: ListEventsParams): Promise<calendarV3.Schema$Event[]> {
    this.throwErrorIfConfigured();
    
    // Respect the maxResults parameter for testing
    return this.data.events.slice(0, params.maxResults);
  }

  private throwErrorIfConfigured(): void {
    if (this.data.shouldThrowError) {
      switch (this.data.shouldThrowError) {
        case 'auth': {
          throw new Error('Authentication failed');
        }

        case 'network': {
          throw new Error('Network error');
        }

        case 'validation': {
          throw new Error('Validation error');
        }

        default: {
          throw new Error('Unknown error');
        }
      }
    }
  }
}

/**
 * Mock implementation of IAuthService that accepts immutable configuration
 */
export class MockAuthService implements IAuthService {
  private readonly data: MockAuthServiceData;

  constructor(data: MockAuthServiceData) {
    this.data = { ...data };
  }

  async getCalendarAuth(): Promise<AuthResult> {
    if (this.data.shouldThrowError) {
      switch (this.data.shouldThrowError) {
        case 'auth': {
          throw new Error('Authentication failed');
        }

        case 'network': {
          throw new Error('Network error');
        }

        default: {
          throw new Error('Unknown error');
        }
      }
    }

    return {
      client: {
        credentials: {
          // eslint-disable-next-line camelcase
          access_token: this.data.accessToken,
          // eslint-disable-next-line camelcase
          refresh_token: this.data.refreshToken,
        },
      },
    };
  }
}

/**
 * Factory function to create MockCalendarService with optional partial data
 */
export function createMockCalendarService(
  partialData?: Partial<MockCalendarServiceData>
): MockCalendarService {
  const defaultData: MockCalendarServiceData = {
    calendars: DEFAULT_MOCK_CALENDARS,
    events: DEFAULT_MOCK_EVENTS,
    shouldThrowError: false,
  };

  const data: MockCalendarServiceData = {
    ...defaultData,
    ...partialData,
  };

  return new MockCalendarService(data);
}

/**
 * Factory function to create MockAuthService with optional partial data
 */
export function createMockAuthService(
  partialData?: Partial<MockAuthServiceData>
): MockAuthService {
  const defaultData: MockAuthServiceData = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    shouldThrowError: false,
  };

  const data: MockAuthServiceData = {
    ...defaultData,
    ...partialData,
  };

  return new MockAuthService(data);
}

/**
 * Create empty mock services for tests that need clean state
 */
export function createEmptyMockCalendarService(): MockCalendarService {
  return createMockCalendarService({
    calendars: [],
    events: [],
  });
}

/**
 * Create mock services that will throw specific errors
 */
export function createErrorMockCalendarService(
  errorType: 'auth' | 'network' | 'validation'
): MockCalendarService {
  return createMockCalendarService({
    shouldThrowError: errorType,
  });
}

export function createErrorMockAuthService(
  errorType: 'auth' | 'network'
): MockAuthService {
  return createMockAuthService({
    shouldThrowError: errorType,
  });
}