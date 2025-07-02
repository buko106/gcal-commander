import { calendar_v3 as calendarV3 } from 'googleapis';
import * as sinon from 'sinon';

import { CreateEventParams, ICalendarService, ListEventsParams } from '../../interfaces/services';

export interface CalendarServiceMockOptions {
  calendars?: calendarV3.Schema$CalendarListEntry[];
  createEventResponse?: calendarV3.Schema$Event;
  errors?: {
    createEvent?: Error;
    getEvent?: Error;
    listCalendars?: Error;
    listEvents?: Error;
  };
  events?: calendarV3.Schema$Event[];
}

/**
 * Factory for creating Calendar Service mocks with sinon integration
 * This provides a stateless, explicit approach to mock creation
 */
export class CalendarServiceMockFactory {
  /**
   * Create a mock ICalendarService with specified behavior
   */
  static create(options: CalendarServiceMockOptions = {}): ICalendarService & sinon.SinonStubbedInstance<ICalendarService> {
    const mock = {
      createEvent: sinon.stub(),
      getEvent: sinon.stub(),
      listCalendars: sinon.stub(),
      listEvents: sinon.stub(),
    } as ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;

    // Configure default behaviors
    this.setupDefaultBehaviors(mock, options);

    return mock;
  }

  /**
   * Create a mock with successful behaviors for typical test scenarios
   */
  static createSuccessful(options: CalendarServiceMockOptions = {}): ICalendarService & sinon.SinonStubbedInstance<ICalendarService> {
    const defaultOptions: CalendarServiceMockOptions = {
      events: options.events || this.getDefaultEvents(),
      calendars: options.calendars || this.getDefaultCalendars(),
      createEventResponse: options.createEventResponse || this.getDefaultCreatedEvent(),
      ...options
    };

    return this.create(defaultOptions);
  }

  /**
   * Create a mock that throws errors for testing error scenarios
   */
  static createWithErrors(errors: CalendarServiceMockOptions['errors']): ICalendarService & sinon.SinonStubbedInstance<ICalendarService> {
    return this.create({ errors });
  }

  private static createEventFromParams(params: CreateEventParams): calendarV3.Schema$Event {
    const event: calendarV3.Schema$Event = {
      id: `mock-event-${Date.now()}`,
      summary: params.summary,
      description: params.description,
      location: params.location,
      start: params.start,
      end: params.end,
      htmlLink: `https://calendar.google.com/event?eid=mock-${Date.now()}`,
    };

    if (params.attendees?.length) {
      event.attendees = params.attendees.map(email => ({ email, responseStatus: 'needsAction' }));
    }

    return event;
  }

  private static getDefaultCalendars(): calendarV3.Schema$CalendarListEntry[] {
    return [
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

  private static getDefaultCreatedEvent(): calendarV3.Schema$Event {
    return {
      id: 'mock-created-event',
      summary: 'Created Event',
      start: { dateTime: '2024-01-15T14:00:00Z' },
      end: { dateTime: '2024-01-15T15:00:00Z' },
      htmlLink: 'https://calendar.google.com/event?eid=mock-created',
    };
  }

  private static getDefaultEvents(): calendarV3.Schema$Event[] {
    return [
      {
        id: 'mock-event-1',
        summary: 'Default Mock Event 1',
        start: { dateTime: '2024-01-01T10:00:00Z' },
        end: { dateTime: '2024-01-01T11:00:00Z' },
      },
      {
        id: 'mock-event-2',
        summary: 'Default Mock Event 2',
        start: { dateTime: '2024-01-02T14:00:00Z' },
        end: { dateTime: '2024-01-02T15:00:00Z' },
      },
    ];
  }

  private static setupDefaultBehaviors(
    mock: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>,
    options: CalendarServiceMockOptions
  ): void {
    // List Events
    if (options.errors?.listEvents) {
      mock.listEvents.rejects(options.errors.listEvents);
    } else {
      mock.listEvents.callsFake(async (params: ListEventsParams) => {
        const events = options.events || this.getDefaultEvents();

        return events.slice(0, params.maxResults);
      });
    }

    // Create Event
    if (options.errors?.createEvent) {
      mock.createEvent.rejects(options.errors.createEvent);
    } else {
      mock.createEvent.callsFake(async (params: CreateEventParams) => {
        const response = options.createEventResponse || this.createEventFromParams(params);

        return response;
      });
    }

    // Get Event
    if (options.errors?.getEvent) {
      mock.getEvent.rejects(options.errors.getEvent);
    } else {
      mock.getEvent.callsFake(async (eventId: string, _calendarId: string) => {
        const events = options.events || this.getDefaultEvents();
        const event = events.find(e => e.id === eventId);
        if (!event) {
          throw new Error(`Event not found: ${eventId}`);
        }

        return event;
      });
    }

    // List Calendars
    if (options.errors?.listCalendars) {
      mock.listCalendars.rejects(options.errors.listCalendars);
    } else {
      mock.listCalendars.resolves(options.calendars || this.getDefaultCalendars());
    }
  }

}