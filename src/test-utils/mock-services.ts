import { calendar_v3 as calendarV3 } from 'googleapis';

import { AuthResult, IAuthService, ICalendarService, ListEventsParams } from '../interfaces/services';

export class MockAuthService implements IAuthService {
  async getCalendarAuth(): Promise<AuthResult> {
    return {
      client: {
        credentials: {
          // eslint-disable-next-line camelcase
          access_token: 'mock-access-token',
          // eslint-disable-next-line camelcase
          refresh_token: 'mock-refresh-token',
        },
      },
    };
  }
}

export class MockCalendarService implements ICalendarService {
  private mockCalendars: calendarV3.Schema$CalendarListEntry[] = [];
  private mockEvents: calendarV3.Schema$Event[] = [];

  constructor() {
    // Set up default mock data
    this.mockEvents = [
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

    this.mockCalendars = [
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
  }

  async getEvent(eventId: string, _calendarId: string): Promise<calendarV3.Schema$Event> {
    const event = this.mockEvents.find(e => e.id === eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    return event;
  }

  async listCalendars(): Promise<calendarV3.Schema$CalendarListEntry[]> {
    return this.mockCalendars;
  }

  async listEvents(params: ListEventsParams): Promise<calendarV3.Schema$Event[]> {
    // Respect the maxResults parameter for testing
    return this.mockEvents.slice(0, params.maxResults);
  }

  setMockCalendars(calendars: calendarV3.Schema$CalendarListEntry[]): void {
    this.mockCalendars = calendars;
  }

  // Helper methods for testing
  setMockEvents(events: calendarV3.Schema$Event[]): void {
    this.mockEvents = events;
  }
}