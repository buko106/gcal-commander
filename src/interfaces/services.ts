import { calendar_v3 as calendarV3 } from 'googleapis';

export interface ListEventsParams {
  calendarId: string;
  maxResults: number;
  timeMax: string;
  timeMin: string;
}

export interface ICalendarService {
  getEvent(eventId: string, calendarId: string): Promise<calendarV3.Schema$Event>;
  listCalendars(): Promise<calendarV3.Schema$CalendarListEntry[]>;
  listEvents(params: ListEventsParams): Promise<calendarV3.Schema$Event[]>;
}

export interface AuthResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
}

export interface IAuthService {
  getCalendarAuth(): Promise<AuthResult>;
}